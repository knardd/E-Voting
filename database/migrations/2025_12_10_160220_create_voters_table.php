<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('voters', function (Blueprint $table) {
            $table->id();
            $table->string('nis')->nullable()->unique()->index();
            $table->string('token', 10)->unique()->index();
            $table->string('name');
            $table->enum('role', ['siswa', 'guru', 'staf'])->default('siswa');
            $table->string('class_dept')->nullable();
            $table->boolean('status_voted')->default(false)->index();
            $table->timestamp('voted_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('voters');
    }
};
