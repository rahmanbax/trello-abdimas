<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class ProjectSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();

        // Menambah data ke tabel projects
        for ($i = 0; $i < 5; $i++) {
            DB::table('projects')->insert([
                'nama_project' => $faker->sentence(4),  // kalimat acak
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
