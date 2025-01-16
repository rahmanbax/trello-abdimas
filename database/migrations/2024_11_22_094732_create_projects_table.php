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
            $table->unsignedBigInteger('iduser');  // Tambahkan kolom iduser
            $table->timestamps();

            $table->foreign('iduser')->references('id')->on('users')->onDelete('cascade');  // Tambahkan foreign key
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
