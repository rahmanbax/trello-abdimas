<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Faker\Factory as Faker;

class TaskSeeder extends Seeder
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

        // Menambahkan data ke tabel 'tasks'
        // Misalnya menambahkan 10 data task
        for ($i = 0; $i < 10; $i++) {
            DB::table('tasks')->insert([
                'nama_task' => $faker->sentence(3),
                'status' => $faker->randomElement([1, 2, 3]),  // status bisa 1, 2, atau 3
                'idproject' => $faker->numberBetween(1, 5),  
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
