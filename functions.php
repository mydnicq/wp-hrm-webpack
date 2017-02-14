<?php
add_action('wp_enqueue_scripts', 'enqueue_css');
add_action('wp_enqueue_scripts', 'enqueue_js');
function enqueue_css()
{
    wp_enqueue_style('my-first-theme', get_stylesheet_uri());
}
function enqueue_js()
{
    wp_enqueue_script('my-js', get_template_directory_uri()."/compiled/js/main.js", null, '0.1', true);
}
