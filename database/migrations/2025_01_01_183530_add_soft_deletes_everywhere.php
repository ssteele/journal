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
        Schema::table('markers', function (Blueprint $table) {
            $table->boolean('enabled')->after('marker')->default(true);
            $table->boolean('deleted')->after('enabled')->default(false);
        });

        Schema::table('mentions', function (Blueprint $table) {
            $table->boolean('enabled')->after('name')->default(true);
            $table->boolean('deleted')->after('enabled')->default(false);
        });

        Schema::table('snippets', function (Blueprint $table) {
            $table->boolean('deleted')->after('enabled')->default(false);
        });

        Schema::table('tags', function (Blueprint $table) {
            $table->boolean('enabled')->after('name')->default(true);
            $table->boolean('deleted')->after('enabled')->default(false);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->boolean('enabled')->after('remember_token')->default(true);
            $table->boolean('deleted')->after('enabled')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('markers', function (Blueprint $table) {
            $table->dropColumn('enabled');
            $table->dropColumn('deleted');
        });

        Schema::table('mentions', function (Blueprint $table) {
            $table->dropColumn('enabled');
            $table->dropColumn('deleted');
        });

        Schema::table('snippets', function (Blueprint $table) {
            $table->dropColumn('deleted');
        });

        Schema::table('tags', function (Blueprint $table) {
            $table->dropColumn('enabled');
            $table->dropColumn('deleted');
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('enabled');
            $table->dropColumn('deleted');
        });
    }
};
