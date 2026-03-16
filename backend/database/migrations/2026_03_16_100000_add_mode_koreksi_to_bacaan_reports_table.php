<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('bacaan_reports', function (Blueprint $table) {
            $table->enum('mode_koreksi', ['langsung', 'catatan'])->default('langsung')->after('jenis_laporan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bacaan_reports', function (Blueprint $table) {
            $table->dropColumn('mode_koreksi');
        });
    }
};
