<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCollaboratorsTable extends Migration
{
    public function up()
    {
        Schema::create('collaborators', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('project_id');
        $table->unsignedBigInteger('user_id');
        $table->timestamps();

        // referensi pk di projects harus 'idproject' bukan 'id'
        $table->foreign('project_id')->references('idproject')->on('projects')->onDelete('cascade');
        $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
    });

    }

    public function down()
    {
        Schema::dropIfExists('collaborators');
    }
}