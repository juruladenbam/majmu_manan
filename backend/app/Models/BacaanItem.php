<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class BacaanItem extends Model
{
    use SoftDeletes;
    protected $guarded = ['id'];

    public function bacaan()
    {
        return $this->belongsTo(Bacaan::class, 'bacaan_id', 'id');
    }

    public function section()
    {
        return $this->belongsTo(BacaanSection::class, 'section_id', 'id');
    }
}