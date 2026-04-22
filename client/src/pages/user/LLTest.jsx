import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Spinner from '../../components/Spinner';
import { TRAFFIC_TEST_QUESTIONS } from '../../utils/constants';

const LLTest = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [testStarted, setTestStarted] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(900);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showRetestOption, setShowRetestOption] = useState(false);
  const [retestLoading, setRetestLoading] = useState(false);

  const llId = location.state?.llId;

  useEffect(() => {
    if (!llId) { toast.error('Direct access to test is restricted'); navigate('/user/dashboard'); }
    else setLoading(false);
  }, [llId, navigate]);

  const recordResult = useCallback(async (finalScore) => {
    try {
      await api.post('/test/submit', { llId, score: finalScore });
    } catch (err) { toast.error('Failed to save test result'); }
  }, [llId]);

  const handleSubmitTest = useCallback(async () => {
    let s = 0;
    TRAFFIC_TEST_QUESTIONS.forEach((q, i) => { if (answers[i] === q.answer) s++; });
    setScore(s);
    setSubmitted(true);
    await recordResult(s);
    if (s < 11) {
      toast.error(`You scored ${s}/15. Minimum 11 required to pass.`);
      setShowRetestOption(true);
    } else {
      toast.success('Congratulations! You passed the LL Test!');
    }
  }, [answers, recordResult]);

  useEffect(() => {
    let timer;
    if (testStarted && !submitted && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && !submitted) {
      handleSubmitTest();
    }
    return () => clearInterval(timer);
  }, [testStarted, submitted, timeLeft, handleSubmitTest]);

  const handleRetest = async () => {
    setRetestLoading(true);
    try {
      // Pay re-test fee and restart
      await api.post('/payment/pay', { serviceType: 'LL-Retest', applicationId: llId, amount: 200 });
      toast.success('Re-test fee paid! Restarting test...');
      setSubmitted(false);
      setTestStarted(false);
      setAnswers({});
      setCurrentIdx(0);
      setTimeLeft(900);
      setScore(0);
      setShowRetestOption(false);
    } catch (err) {
      toast.error('Re-test payment failed. Please try again.');
    } finally {
      setRetestLoading(false);
    }
  };

  const handleCancel = () => {
    toast('Your LL Test result is FAIL. Returning to Dashboard.', { icon: '❌' });
    navigate('/user/dashboard');
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><Spinner text="Authenticating session..." /></div>;

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center animate-fade">
        <div className={`w-32 h-32 mx-auto rounded-full flex items-center justify-center text-5xl mb-8 ${score >= 11 ? 'bg-teal/10 text-teal' : 'bg-red-50 text-red-500'}`}>
          {score >= 11 ? '🏆' : '⚠️'}
        </div>
        <h2 className="text-4xl font-black text-gray-800 mb-2">Test Result: {score >= 11 ? 'PASSED' : 'FAILED'}</h2>
        <p className="text-xl text-gray-500 mb-6">You scored <span className="font-black text-primary">{score} out of 15</span></p>

        {score >= 11 ? (
          <>
            <p className="text-sm text-gray-400 max-w-sm mx-auto mb-8 leading-relaxed">
              Your application has been moved to the RTO Officer for final approval. Usually takes 24-48 working hours.
            </p>
            <button onClick={() => navigate('/user/dashboard')} className="btn-primary w-full py-4 rounded-3xl">Back to Dashboard</button>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-400 max-w-sm mx-auto mb-6 leading-relaxed">
              You need at least 11 correct answers to pass. Please choose an option below.
            </p>
            <div className="space-y-4">
              <button onClick={handleRetest} disabled={retestLoading}
                className="btn-primary w-full py-4 rounded-3xl flex items-center justify-center gap-2">
                {retestLoading ? <Spinner size="sm" /> : '🔄'} Re-Test (Pay ₹200 fee)
              </button>
              <button onClick={handleCancel}
                className="w-full py-4 rounded-3xl bg-red-50 text-red-600 font-black hover:bg-red-100 transition-all border-2 border-red-100">
                ❌ Cancel — Accept FAIL Result
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 animate-fade">
        <div className="card text-center p-12">
          <h1 className="text-4xl font-black text-gray-800 mb-6">Read Carefully.</h1>
          <div className="space-y-4 text-left mb-10">
            {[
              '15 questions about traffic rules and signs.',
              '15 minutes total time. Failing to finish will auto-submit.',
              '11 correct answers required to pass.',
              'If you score below 11, you can Re-Test after paying ₹200 fee or Cancel.',
            ].map((rule, i) => (
              <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-2xl items-center">
                <span className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold shrink-0">{i + 1}</span>
                <p className="text-sm text-gray-600 font-medium">{rule}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setTestStarted(true)} className="btn-primary w-full py-5 text-xl tracking-tighter">Start My LL Test</button>
        </div>
      </div>
    );
  }

  const currentQ = TRAFFIC_TEST_QUESTIONS[currentIdx];

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 animate-fade">
      <div className="flex justify-between items-center mb-8">
        <div>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Question {currentIdx + 1} of 15</p>
          <div className="w-64 h-2 bg-gray-100 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((currentIdx + 1) / 15) * 100}%` }} />
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-gray-400 uppercase">Time Remaining</p>
          <p className={`text-2xl font-black ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-gray-800'}`}>
            {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
          </p>
        </div>
      </div>

      <div className="card min-h-[400px] flex flex-col justify-between p-12">
        <div>
          <h2 className="text-2xl font-black text-gray-800 mb-8 leading-tight">{currentQ.question}</h2>
          {currentQ.image && <img src={currentQ.image} className="h-32 mb-8 rounded-2xl border" alt="sign" />}
          <div className="space-y-4">
            {currentQ.options.map((opt, i) => (
              <button key={i} onClick={() => setAnswers({ ...answers, [currentIdx]: i })}
                className={`w-full text-left p-6 rounded-2xl border-2 transition-all font-bold flex justify-between items-center ${answers[currentIdx] === i ? 'border-primary bg-blue-50 text-primary' : 'border-gray-50 hover:border-gray-200 text-gray-600'}`}>
                <span>{opt}</span>
                <div className={`w-6 h-6 rounded-full border-4 ${answers[currentIdx] === i ? 'border-primary bg-primary' : 'border-gray-200'}`} />
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-between items-center mt-12 gap-4">
          <button onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))} disabled={currentIdx === 0}
            className="flex-1 btn-secondary py-4 disabled:opacity-30">Previous</button>
          {currentIdx === 14 ? (
            <button onClick={handleSubmitTest} className="flex-[2] btn-success py-4 rounded-2xl shadow-xl">Complete & Submit Test</button>
          ) : (
            <button onClick={() => setCurrentIdx(prev => prev + 1)} className="flex-[2] btn-primary py-4 rounded-2xl shadow-xl">Next Question</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LLTest;
