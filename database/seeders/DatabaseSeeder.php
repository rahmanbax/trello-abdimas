<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // Panggil seeder
        $this->call([
            ProjectSeeder::class,
            TaskSeeder::class, 
        ]);
    }
}
