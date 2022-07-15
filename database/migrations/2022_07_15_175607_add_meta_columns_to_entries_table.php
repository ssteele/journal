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
        Schema::create('tags', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
            $table->string('name', 128);
            $table->timestamps();
        });

        Schema::create('mentions', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
            $table->string('name', 128);
            $table->timestamps();
        });

        Schema::create('marker_categories', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')
                ->references('id')
                ->on('users')
                ->onDelete('cascade');
            $table->string('name', 128);
            $table->string('shorthand', 1)->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();
        });

        Schema::create('markers', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('marker_category_id')->unsigned();
            $table->foreign('marker_category_id')
                ->references('id')
                ->on('marker_categories')
                ->onDelete('cascade');
            $table->unsignedBigInteger('entry_id');
            $table->foreign('entry_id')
                ->references('id')
                ->on('entries')
                ->onDelete('cascade');
            $table->text('marker');
            $table->timestamps();
        });

        Schema::create('entry_has_tags', function (Blueprint $table) {
            $table->unsignedBigInteger('entry_id');
            $table->foreign('entry_id')
                ->references('id')
                ->on('entries')
                ->onDelete('cascade');
            $table->integer('tag_id')->unsigned();
            $table->foreign('tag_id')
                ->references('id')
                ->on('tags')
                ->onDelete('cascade');
        });

        Schema::create('entry_has_mentions', function (Blueprint $table) {
            $table->unsignedBigInteger('entry_id');
            $table->foreign('entry_id')
                ->references('id')
                ->on('entries')
                ->onDelete('cascade');
            $table->integer('mention_id')->unsigned();
            $table->foreign('mention_id')
                ->references('id')
                ->on('mentions')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('entry_has_tags');
        Schema::dropIfExists('entry_has_mentions');
        Schema::dropIfExists('tags');
        Schema::dropIfExists('mentions');
        Schema::dropIfExists('markers');
        Schema::dropIfExists('marker_categories');
    }
};
