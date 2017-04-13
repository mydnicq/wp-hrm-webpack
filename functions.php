<?php
define("VERSION", "1.0");
add_action('wp_enqueue_scripts', 'enqueue_css');
add_action('wp_enqueue_scripts', 'enqueue_js');
function enqueue_css()
{
    wp_enqueue_style('main-css', get_template_directory_uri()."/compiled/main.css", null, VERSION, false);
}
function enqueue_js()
{
    wp_enqueue_script('main-js', get_template_directory_uri()."/compiled/js/main.js", null, VERSION, true);
}
