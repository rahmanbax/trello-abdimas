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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id('idtask');
            $table->string('nama_task');
            $table->enum('status', [1, 2, 3])->default(1);
            $table->unsignedBigInteger('idproject');
            $table->timestamps();

            // foregin key ke project
            $table->foreign('idproject')->references('idproject')->on('projects')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tasks');
    }
};
