<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bacaan extends Model
{
    protected $table = 'bacaans';
    protected $guarded = ['id'];

    public function sections()
    {
        return $this->hasMany(BacaanSection::class, 'bacaan_id', 'id');
    }

    public function items()
    {
        return $this->hasMany(BacaanItem::class, 'bacaan_id', 'id');
    }
}