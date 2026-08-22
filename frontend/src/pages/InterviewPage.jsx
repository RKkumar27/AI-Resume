import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import Button from '../components/Button';
import Badge from '../components/Badge';
import Textarea from '../components/Textarea';
import Select from '../components/Select';
import ScoreCircle from '../components/ScoreCircle';
import { useToast } from '../context/ToastContext';
import { aiAPI } from '../services/api';
import { Video, Sparkles, CheckCircle2, AlertCircle, HelpCircle, Send } from 'lucide-react';

export const InterviewPage = () => {
  const toast = useToast();
  const [category, setCategory] = useState('Technical System Design');
  const [questionData, setQuestionData] = useState({
    question: "How would you design a high-throughput rate limiter service for a microservices architecture handling 100,000 requests per second?",
    tips: [
      "Discuss algorithms (Sliding Window Counter / Token Bucket)",
      "Explain Redis in-memory storage and distributed locks",
      "Mention HTTP rate limit headers"
    ]
  });
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);

  const handleGenerateQuestion = async () => {
    setLoading(true);
    try {
      const res = await aiAPI.generateInterview({ category });
      if (res.data && res.data.data) {
        setQuestionData(res.data.data);
        setUserAnswer('');
        setEvaluation(null);
        toast.success(`Generated new ${category} question!`);
      }
    } catch (err) {
      toast.error('Failed to generate interview question.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) {
      toast.warning('Please enter your response before submitting.');
      return;
    }

    setEvaluating(true);
    try {
      const res = await aiAPI.evaluateAnswer({
        question: questionData.question,
        user_answer: userAnswer
      });

      if (res.data && res.data.data) {
        setEvaluation(res.data.data);
        toast.success(`Answer evaluated! Score: ${res.data.data.score}%`);
      }
    } catch (err) {
      toast.error('Failed to evaluate answer.');
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />

      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />

        <main style={{ flex: 1, padding: 'var(--space-xl)', overflowY: 'auto' }}>
          <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-xl)' }}>
            <div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>AI Mock Interview Practice</h1>
              <p className="text-muted" style={{ fontSize: '0.9375rem', marginTop: '0.2rem' }}>
                Practice role-specific technical and behavioral questions with instant AI scoring, clarity analysis, and improvement tips.
              </p>
            </div>

            <Button variant="primary" icon={Sparkles} loading={loading} onClick={handleGenerateQuestion}>
              Generate Next Question
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-lg">
            {/* Left Column: Question & Answer Form */}
            <div className="flex flex-col gap-lg">
              <Card title="Question Category Selection">
                <Select
                  label="Select Interview Focus"
                  options={['Technical System Design', 'Backend Architecture', 'Algorithms & Data Structures', 'Behavioral Leadership']}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                />
              </Card>

              <Card title="Current Interview Question">
                <div style={{
                  padding: '1.25rem',
                  backgroundColor: 'var(--color-bg-main)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  marginBottom: '1rem'
                }}>
                  <div className="flex items-center gap-xs text-primary" style={{ fontWeight: 600, fontSize: '0.8125rem', marginBottom: '0.5rem' }}>
                    <HelpCircle size={16} /> {category} Question:
                  </div>
                  <p style={{ fontWeight: 700, fontSize: '1.0625rem', lineHeight: 1.5, color: 'var(--color-text-main)' }}>
                    {questionData.question}
                  </p>
                </div>

                {questionData.tips && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontWeight: 600, fontSize: '0.8125rem', color: 'var(--color-text-subtle)', marginBottom: '0.35rem' }}>
                      Key Answer Indicators:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {questionData.tips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <form onSubmit={handleSubmitAnswer}>
                  <Textarea
                    label="Your Response / System Architecture Plan"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Type your structured answer here (e.g., I would design a Redis-backed sliding window counter algorithm across worker nodes)..."
                    rows={6}
                    required
                  />

                  <Button type="submit" variant="primary" fullWidth loading={evaluating} icon={Send} style={{ marginTop: '1rem' }}>
                    Submit Answer for AI Evaluation
                  </Button>
                </form>
              </Card>
            </div>

            {/* Right Column: AI Evaluation Report */}
            <div>
              {evaluation ? (
                <Card title="AI Answer Evaluation Report">
                  <div className="flex items-center justify-between" style={{ marginBottom: '1.5rem' }}>
                    <div>
                      <div className="text-muted" style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Overall Response Score</div>
                      <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-success)' }}>
                        {evaluation.score}%
                      </div>
                    </div>
                    <ScoreCircle score={evaluation.score} maxScore={100} />
                  </div>

                  <div className="grid grid-cols-2 gap-sm" style={{ padding: '0.875rem', backgroundColor: 'var(--color-bg-main)', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                    <div>
                      <div className="text-subtle" style={{ fontSize: '0.75rem' }}>Clarity Rating</div>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{evaluation.clarity_score}%</div>
                    </div>
                    <div>
                      <div className="text-subtle" style={{ fontSize: '0.75rem' }}>Technical Accuracy</div>
                      <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{evaluation.technical_accuracy}%</div>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.875rem', marginBottom: '0.4rem' }}>Evaluation Feedback:</div>
                    <p className="text-muted" style={{ fontSize: '0.875rem', lineHeight: 1.5 }}>
                      {evaluation.feedback}
                    </p>
                  </div>

                  <div style={{ marginBottom: '1.25rem' }}>
                    <div className="flex items-center gap-xs text-success" style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                      <CheckCircle2 size={16} /> Strengths Identified:
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {evaluation.strengths.map((str, idx) => (
                        <li key={idx}>{str}</li>
                      ))}
                    </ul>
                  </div>

                  {evaluation.improvements && evaluation.improvements.length > 0 && (
                    <div>
                      <div className="flex items-center gap-xs text-warning" style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.35rem' }}>
                        <AlertCircle size={16} /> Recommended Improvements:
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {evaluation.improvements.map((imp, idx) => (
                          <li key={idx}>{imp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>
              ) : (
                <Card style={{ padding: '3rem 1.5rem', textAlign: 'center' }}>
                  <Video size={36} color="var(--color-primary)" style={{ margin: '0 auto 1rem' }} />
                  <h3>AI Evaluation Report Placeholder</h3>
                  <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '0.4rem' }}>
                    Type your answer in the left panel and click "Submit Answer" to receive instant AI scoring, technical accuracy evaluation, and constructive feedback.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InterviewPage;
