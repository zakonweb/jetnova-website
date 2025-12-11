<?php
/**
 * JetNova Travel Theme Functions
 * 
 * World-Class AI-Powered B2B Travel Platform
 * Version: 3.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Theme Setup
 */
function jetnova_theme_setup() {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script'
    ));
    add_theme_support('custom-logo', array(
        'height'      => 100,
        'width'       => 400,
        'flex-height' => true,
        'flex-width'  => true,
    ));
    add_theme_support('responsive-embeds');
    add_theme_support('align-wide');
    
    // Register navigation menus
    register_nav_menus(array(
        'primary'   => __('Primary Menu', 'jetnova'),
        'footer'    => __('Footer Menu', 'jetnova'),
        'mobile'    => __('Mobile Menu', 'jetnova'),
    ));
}
add_action('after_setup_theme', 'jetnova_theme_setup');

/**
 * Enqueue Styles and Scripts
 */
function jetnova_enqueue_scripts() {
    // Theme stylesheet
    wp_enqueue_style(
        'jetnova-style',
        get_stylesheet_uri(),
        array(),
        wp_get_theme()->get('Version')
    );
    
    // Google Fonts
    wp_enqueue_style(
        'jetnova-fonts',
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap',
        array(),
        null
    );
    
    // Main JavaScript
    wp_enqueue_script(
        'jetnova-main',
        get_template_directory_uri() . '/js/main.js',
        array(),
        wp_get_theme()->get('Version'),
        true // Load in footer
    );
    
    // Pass PHP variables to JavaScript
    wp_localize_script(
        'jetnova-main',
        'jetnovaData',
        array(
            'ajaxUrl'    => admin_url('admin-ajax.php'),
            'nonce'      => wp_create_nonce('jetnova_nonce'),
            'homeUrl'    => home_url('/'),
            // REST API endpoint for the live demo chat widget
            'chatApiUrl' => rest_url('jetnova/v1/chat'),
        )
    );
}
add_action('wp_enqueue_scripts', 'jetnova_enqueue_scripts');

/**
 * Add preload for critical resources
 */
function jetnova_resource_hints($urls, $relation_type) {
    if ('preconnect' === $relation_type) {
        $urls[] = array(
            'href' => 'https://fonts.googleapis.com',
            'crossorigin' => '',
        );
        $urls[] = array(
            'href' => 'https://fonts.gstatic.com',
            'crossorigin' => 'anonymous',
        );
    }
    return $urls;
}
add_filter('wp_resource_hints', 'jetnova_resource_hints', 10, 2);

/**
 * Remove WordPress version from head
 */
remove_action('wp_head', 'wp_generator');

/**
 * Add custom body classes
 */
function jetnova_body_classes($classes) {
    // Add page slug as class
    if (is_single() || is_page()) {
        global $post;
        $classes[] = 'page-' . $post->post_name;
    }
    
    // Add home class
    if (is_front_page()) {
        $classes[] = 'is-home';
    }
    
    return $classes;
}
add_filter('body_class', 'jetnova_body_classes');

/**
 * Custom excerpt length
 */
function jetnova_excerpt_length($length) {
    return 30;
}
add_filter('excerpt_length', 'jetnova_excerpt_length');

/**
 * Custom excerpt more text
 */
function jetnova_excerpt_more($more) {
    return '...';
}
add_filter('excerpt_more', 'jetnova_excerpt_more');

/**
 * Register widget areas
 */
function jetnova_widgets_init() {
    register_sidebar(array(
        'name'          => __('Footer Widget Area', 'jetnova'),
        'id'            => 'footer-widgets',
        'description'   => __('Add widgets here to appear in your footer.', 'jetnova'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ));
}
add_action('widgets_init', 'jetnova_widgets_init');

/**
 * Optimize WordPress for performance
 */
function jetnova_optimize_wp() {
    // Remove emoji scripts
    remove_action('wp_head', 'print_emoji_detection_script', 7);
    remove_action('admin_print_scripts', 'print_emoji_detection_script');
    remove_action('wp_print_styles', 'print_emoji_styles');
    remove_action('admin_print_styles', 'print_emoji_styles');
    remove_filter('the_content_feed', 'wp_staticize_emoji');
    remove_filter('comment_text_rss', 'wp_staticize_emoji');
    remove_filter('wp_mail', 'wp_staticize_emoji_for_email');
    
    // Remove RSD link
    remove_action('wp_head', 'rsd_link');
    
    // Remove Windows Live Writer link
    remove_action('wp_head', 'wlwmanifest_link');
    
    // Remove shortlink
    remove_action('wp_head', 'wp_shortlink_wp_head');
    
    // Remove REST API link
    remove_action('wp_head', 'rest_output_link_wp_head');
    
    // Remove oEmbed discovery links
    remove_action('wp_head', 'wp_oembed_add_discovery_links');
}
add_action('init', 'jetnova_optimize_wp');

/**
 * Add defer/async to scripts
 */
function jetnova_defer_scripts($tag, $handle) {
    $defer_scripts = array('jetnova-main');
    
    if (in_array($handle, $defer_scripts)) {
        return str_replace(' src', ' defer src', $tag);
    }
    
    return $tag;
}
add_filter('script_loader_tag', 'jetnova_defer_scripts', 10, 2);

/**
 * Security headers
 */
function jetnova_security_headers() {
    if (!is_admin()) {
        header('X-Content-Type-Options: nosniff');
        header('X-Frame-Options: SAMEORIGIN');
        header('X-XSS-Protection: 1; mode=block');
        header('Referrer-Policy: strict-origin-when-cross-origin');
    }
}
add_action('send_headers', 'jetnova_security_headers');

/**
 * Custom login logo
 */
function jetnova_login_logo() {
    ?>
    <style>
        #login h1 a {
            background-image: url(<?php echo get_template_directory_uri(); ?>/logo.png);
            background-size: contain;
            width: 200px;
            height: 80px;
        }
    </style>
    <?php
}
add_action('login_enqueue_scripts', 'jetnova_login_logo');

/**
 * Custom login URL
 */
function jetnova_login_url() {
    return home_url('/');
}
add_filter('login_headerurl', 'jetnova_login_url');

/**
 * Disable XML-RPC
 */
add_filter('xmlrpc_enabled', '__return_false');

/**
 * Theme version constant
 */
define('JETNOVA_VERSION', '3.0.0');

/**
 * Cloudflare Worker chat endpoint
 *
 * Chatbase credentials are stored securely in the Worker (wrangler.toml),
 * so WordPress only needs to talk to the Worker – it never sees API keys.
 */
if (!defined('JETNOVA_WORKER_CHAT_URL')) {
    define(
        'JETNOVA_WORKER_CHAT_URL',
        'https://jetnova-website-chat.zakonweb.workers.dev/chat'
    );
}

/**
 * REST API endpoint for the JetNova Live demo widget
 *
 * Route: /wp-json/jetnova/v1/chat
 * This endpoint proxies requests to Chatbase so that the API key never
 * touches the browser and we avoid cross-origin/CORS issues.
 */
function jetnova_register_chat_route() {
    register_rest_route(
        'jetnova/v1',
        '/chat',
        array(
            'methods'             => 'POST',
            'callback'            => 'jetnova_handle_chat_request',
            'permission_callback' => '__return_true',
        )
    );
}
add_action('rest_api_init', 'jetnova_register_chat_route');

/**
 * Handle incoming chat requests from the demo widget and forward them
 * to the Chatbase API.
 *
 * @param WP_REST_Request $request
 * @return WP_REST_Response
 */
function jetnova_handle_chat_request($request) {
    $params         = $request->get_json_params();
    $message        = isset($params['message']) ? trim((string) $params['message']) : '';
    $conversationId = isset($params['conversationId']) ? (string) $params['conversationId'] : '';
    $history        = isset($params['history']) && is_array($params['history']) ? $params['history'] : array();

    if ($message === '' && empty($history)) {
        return new WP_REST_Response(
            array(
                'response' => 'Please type a question so I can help you.',
            ),
            400
        );
    }

    // Forward the payload exactly as the Worker expects so that
    // credentials and Chatbase logic remain there.
    $worker_payload = array(
        'message'        => $message,
        'conversationId' => $conversationId,
        'history'        => $history,
    );

    $response = wp_remote_post(
        JETNOVA_WORKER_CHAT_URL,
        array(
            'headers' => array(
                'Content-Type' => 'application/json',
            ),
            'body'    => wp_json_encode($worker_payload),
            'timeout' => 20,
        )
    );

    if (is_wp_error($response)) {
        return new WP_REST_Response(
            array(
                'response' => "I couldn't reach the JetNova AI server right now. Please try again in a moment.",
            ),
            200
        );
    }

    $status_code = wp_remote_retrieve_response_code($response);
    $body        = wp_remote_retrieve_body($response);
    $data        = json_decode($body, true);

    if ($status_code < 200 || $status_code >= 300 || !is_array($data)) {
        return new WP_REST_Response(
            array(
                'response' => 'I received an unexpected response from the JetNova AI server. Please try again shortly.',
            ),
            200
        );
    }

    // Return the Worker response as-is so the frontend sees exactly
    // what it would have received when talking directly to the Worker.
    return new WP_REST_Response($data, 200);
}

/**
 * Debug helper (only in development)
 */
if (defined('WP_DEBUG') && WP_DEBUG) {
    function jetnova_debug($data) {
        echo '<pre>';
        print_r($data);
        echo '</pre>';
    }
}
