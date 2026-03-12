<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BacaanReport extends Model
{
    protected $fillable = [
        'bacaan_id',
        'pelapor_nama',
        'pelapor_email',
        'kategori',
        'jenis_laporan',
        'target_id',
        'field_koreksi',
        'konten_asli',
        'konten_koreksi',
        'status',
    ];

    protected $casts = [
        'field_koreksi' => 'array',
        'konten_asli' => 'array',
        'konten_koreksi' => 'array',
    ];

    public function bacaan(): BelongsTo
    {
        return $this->belongsTo(Bacaan::class);
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(BacaanItem::class, 'target_id');
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(BacaanSection::class, 'target_id');
    }
}
