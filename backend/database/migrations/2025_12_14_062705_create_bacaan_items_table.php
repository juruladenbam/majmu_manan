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
        Schema::create('bacaan_items', function (Blueprint $table) {
            $table->id();
            $table->integer('bacaan_id')->index();
            $table->foreignId('section_id')->nullable()->index();
            $table->integer('urutan')->default(0);
            $table->longText('arabic')->nullable();
            $table->longText('latin')->nullable();
            $table->longText('terjemahan')->nullable();
            $table->enum('tipe_tampilan', ['text', 'syiir', 'judul_tengah', 'image', 'keterangan'])->default('text');
            $table->text('note_kaki')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bacaan_items');
    }
};
