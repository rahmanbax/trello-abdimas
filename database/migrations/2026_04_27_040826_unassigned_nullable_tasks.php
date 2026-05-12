<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table("tasks", function (Blueprint $table) {
            $table->dropForeign(["idproject"]);
            $table->unsignedBigInteger("idproject")->nullable()->change();
            $table->foreign("idproject")
                ->references("idproject")
                ->on("projects")
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table("tasks", function (Blueprint $table) {
            $table->dropForeign(["idproject"]);
            $table->unsignedBigInteger("idproject")->nullable(false)->change();
            $table->foreign("idproject")
                ->references("idproject")
                ->on("projects")
                ->cascadeOnDelete();
        });
    }
};