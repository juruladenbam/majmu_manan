<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BacaanSection extends Model
{
    protected $guarded = ['id'];

    public function bacaan()
    {
        return $this->belongsTo(Bacaan::class, 'bacaan_id', 'id');
    }

    public function items()
    {
        return $this->hasMany(BacaanItem::class, 'section_id', 'id');
    }
}