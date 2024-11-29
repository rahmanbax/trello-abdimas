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
        // Inisialisasi Faker untuk generate data acak
        $faker = Faker::create();

        // Menambahkan data ke tabel 'projects'
        // Misalnya menambahkan 5 project
        for ($i = 0; $i < 5; $i++) {
            DB::table('projects')->insert([
                'nama_project' => $faker->sentence(4),  // Nama project berupa kalimat acak
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
