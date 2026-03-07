import { useState, useEffect } from 'react';
import {
  getSettings,
  setSettings,
  exportData,
  importData,
  getReadingSessions,
  getBooks,
} from '../utils/storage';
import { formatMinutes } from '../utils/changeTime';
import './styles/PageCommon.css';
import './styles/SettingsPage.css';

function SettingsPage() {
  const [goals, setGoals] = useState({
    dailyGoalMinutes: 30,
    weeklyGoalMinutes: 210,
    monthlyGoalMinutes: 900,
    yearlyGoalMinutes: 10950,
    bookGoalCount: 50,
  });
  const [saved, setSaved] = useState(false);
  const [importMode, setImportMode] = useState('replace');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  useEffect(() => {
    setGoals(getSettings());
  }, []);

  const handleGoalChange = (field, value) => {
    const n = parseInt(value, 10);
    if (Number.isNaN(n) || n < 0) return;
    setGoals((prev) => ({ ...prev, [field]: n }));
    setSaved(false);
  };

  const handleSaveGoals = () => {
    setSettings(goals);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reading-record-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError('');
    setImportSuccess(false);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        importData(data, importMode);
        setImportSuccess(true);
        setGoals(getSettings());
        setTimeout(() => setImportSuccess(false), 3000);
      } catch (err) {
        setImportError(err.message || 'ファイルの読み込みに失敗しました。');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const sessionCount = getReadingSessions().length;
  const bookCount = getBooks().length;

  return (
    <div className="page-wrapper settings-page">
      <div className="settings-page-card">
        <div className="settings-page-card-content">
          <h2 className="page-heading settings-page-heading">Settings</h2>

          <section className="settings-section" aria-labelledby="settings-goals-heading">
            <h3 id="settings-goals-heading" className="settings-section-title">
              読書目標
            </h3>
            <p className="settings-section-desc">
              Home の「今日の読書と統計」で表示する目標値です。
            </p>
            <div className="settings-goals-grid">
              <div className="settings-field">
                <label htmlFor="goal-daily">1日の目標（分）</label>
                <input
                  id="goal-daily"
                  type="number"
                  min="0"
                  value={goals.dailyGoalMinutes}
                  onChange={(e) => handleGoalChange('dailyGoalMinutes', e.target.value)}
                />
              </div>
              <div className="settings-field">
                <label htmlFor="goal-weekly">週の目標（分）</label>
                <input
                  id="goal-weekly"
                  type="number"
                  min="0"
                  value={goals.weeklyGoalMinutes}
                  onChange={(e) => handleGoalChange('weeklyGoalMinutes', e.target.value)}
                />
                <span className="settings-field-hint">
                  {formatMinutes(goals.weeklyGoalMinutes)}
                </span>
              </div>
              <div className="settings-field">
                <label htmlFor="goal-monthly">月の目標（分）</label>
                <input
                  id="goal-monthly"
                  type="number"
                  min="0"
                  value={goals.monthlyGoalMinutes}
                  onChange={(e) => handleGoalChange('monthlyGoalMinutes', e.target.value)}
                />
                <span className="settings-field-hint">
                  {formatMinutes(goals.monthlyGoalMinutes)}
                </span>
              </div>
              <div className="settings-field">
                <label htmlFor="goal-yearly">年の目標（分）</label>
                <input
                  id="goal-yearly"
                  type="number"
                  min="0"
                  value={goals.yearlyGoalMinutes}
                  onChange={(e) => handleGoalChange('yearlyGoalMinutes', e.target.value)}
                />
                <span className="settings-field-hint">
                  {formatMinutes(goals.yearlyGoalMinutes)}
                </span>
              </div>
              <div className="settings-field">
                <label htmlFor="goal-books">目標読書冊数（冊/年）</label>
                <input
                  id="goal-books"
                  type="number"
                  min="0"
                  value={goals.bookGoalCount}
                  onChange={(e) => handleGoalChange('bookGoalCount', e.target.value)}
                />
              </div>
            </div>
            <button
              type="button"
              className="settings-save-btn"
              onClick={handleSaveGoals}
            >
              {saved ? '保存しました' : '目標を保存'}
            </button>
          </section>

          <section className="settings-section" aria-labelledby="settings-data-heading">
            <h3 id="settings-data-heading" className="settings-section-title">
              データのバックアップ
            </h3>
            <p className="settings-section-desc">
              現在の記録: 読書セッション {sessionCount} 件、本 {bookCount} 冊
            </p>
            <div className="settings-data-actions">
              <button type="button" className="settings-export-btn" onClick={handleExport}>
                データをエクスポート（JSON）
              </button>
            </div>
          </section>

          <section className="settings-section" aria-labelledby="settings-import-heading">
            <h3 id="settings-import-heading" className="settings-section-title">
              データの復元
            </h3>
            <p className="settings-section-desc">
              エクスポートした JSON からデータを復元します。
            </p>
            <div className="settings-import-options">
              <label className="settings-radio">
                <input
                  type="radio"
                  name="importMode"
                  value="replace"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                />
                <span>上書き（現在のデータは置き換え）</span>
              </label>
              <label className="settings-radio">
                <input
                  type="radio"
                  name="importMode"
                  value="merge"
                  checked={importMode === 'merge'}
                  onChange={() => setImportMode('merge')}
                />
                <span>マージ（既存データに追加）</span>
              </label>
            </div>
            <div className="settings-import-actions">
              <label className="settings-import-label">
                <span className="settings-import-btn">ファイルを選択</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleImportFile}
                  className="settings-import-input"
                />
              </label>
            </div>
            {importError && (
              <p className="settings-message settings-message--error" role="alert">
                {importError}
              </p>
            )}
            {importSuccess && (
              <p className="settings-message settings-message--success" role="status">
                データを復元しました。ページを再読み込みすると反映されます。
              </p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
