<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id('idproject');
            $table->string('nama_project');
<<<<<<< HEAD
            // Menambahkan kolom iduser sebagai foreign key
            $table->unsignedBigInteger('iduser');
            $table->timestamps();

            // Menambahkan foreign key constraint pada kolom iduser
            $table->foreign('iduser')->references('id')->on('users')->onDelete('cascade');
=======
            $table->unsignedBigInteger('iduser');  // Tambahkan kolom iduser
            $table->timestamps();

            $table->foreign('iduser')->references('id')->on('users')->onDelete('cascade');  // Tambahkan foreign key
>>>>>>> save
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('projects');
    }
};
