<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Bacaan extends Model
{
    use SoftDeletes;
    protected $table = 'bacaans';
    protected $guarded = ['id'];

    protected $casts = [
        'is_multi_section' => 'boolean'
    ];

    public function sections()
    {
        return $this->hasMany(BacaanSection::class, 'bacaan_id', 'id');
    }

    public function items()
    {
        return $this->hasMany(BacaanItem::class, 'bacaan_id', 'id');
    }
}