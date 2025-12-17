<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = AppSetting::all()->pluck('value', 'key');
        return response()->json($settings);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'maintenance_mode' => 'nullable|boolean',
            'maintenance_message' => 'nullable|string',
        ]);

        foreach ($data as $key => $value) {
            AppSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return response()->json(['message' => 'Settings updated successfully']);
    }

    public function checkMaintenance()
    {
        $maintenance = AppSetting::where('key', 'maintenance_mode')->first();
        $message = AppSetting::where('key', 'maintenance_message')->first();

        return response()->json([
            'maintenance_mode' => $maintenance ? filter_var($maintenance->value, FILTER_VALIDATE_BOOLEAN) : false,
            'maintenance_message' => $message ? $message->value : null,
        ]);
    }
}
