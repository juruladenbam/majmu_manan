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
        Schema::create('bacaan_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bacaan_id')->constrained('bacaans')->onDelete('cascade');
            $table->string('pelapor_nama', 255)->nullable();
            $table->string('pelapor_email', 255)->nullable();
            $table->enum('kategori', ['salah_ketik', 'teks_hilang', 'terjemahan_salah', 'lain_lain']);
            $table->enum('jenis_laporan', ['bacaan', 'section', 'item']);
            $table->unsignedBigInteger('target_id')->nullable();
            $table->json('field_koreksi')->nullable();
            $table->longText('konten_asli')->nullable();
            $table->longText('konten_koreksi')->nullable();
            $table->enum('status', ['pending', 'disetujui', 'ditolak'])->default('pending');
            $table->timestamps();
            
            $table->index(['bacaan_id', 'status']);
            $table->index('jenis_laporan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bacaan_reports');
    }
};
