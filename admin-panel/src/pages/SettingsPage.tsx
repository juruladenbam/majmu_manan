import { useEffect, useState } from 'react';
import { settingsApi } from '../features/settings/api';

export const SettingsPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [maintenanceMessage, setMaintenanceMessage] = useState('');

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            setIsLoading(true);
            const data = await settingsApi.getSettings();
            setMaintenanceMode(data.maintenance_mode);
            setMaintenanceMessage(data.maintenance_message || '');
        } catch (error) {
            console.error('Failed to load settings:', error);
            alert('Failed to load settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await settingsApi.updateSettings({
                maintenance_mode: maintenanceMode,
                maintenance_message: maintenanceMessage,
            });
            alert('Settings saved successfully');
        } catch (error) {
            console.error('Failed to save settings:', error);
            alert('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="p-6">Loading settings...</div>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-text-main dark:text-white">Settings</h1>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-2xl">
                <h2 className="text-lg font-semibold mb-4 text-text-main dark:text-gray-200">Maintenance Mode</h2>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <label className="font-medium text-text-main dark:text-gray-200">Enable Maintenance Mode</label>
                            <p className="text-sm text-text-secondary dark:text-gray-400">
                                When enabled, the public app will show a maintenance page.
                            </p>
                        </div>
                        <button
                            onClick={() => setMaintenanceMode(!maintenanceMode)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${maintenanceMode ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    {maintenanceMode && (
                        <div>
                            <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-1">
                                Maintenance Message (Optional)
                            </label>
                            <textarea
                                value={maintenanceMessage}
                                onChange={(e) => setMaintenanceMessage(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-transparent text-text-main dark:text-white"
                                rows={3}
                                placeholder="We are currently undergoing maintenance..."
                            />
                        </div>
                    )}

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-4 py-2 bg-primary hover:bg-primary-dark text-stone-900 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
