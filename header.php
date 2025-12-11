<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="JetNova AI - A web-based, AI-powered B2B travel platform for agencies. Real-time flight search, booking, and 24/7 assistance from any browser, with messaging integrations like WhatsApp on the roadmap.">
    <meta name="keywords" content="AI travel, web-based travel platform, travel agency software, GDS integration, flight booking, travel management, JetNova AI">
    <meta name="author" content="JetNova AI">
    
    <!-- Open Graph -->
    <meta property="og:title" content="JetNova AI - Web-Based AI Travel Platform">
    <meta property="og:description" content="Transform your travel agency with a web-based AI assistant. Real-time flight search, intelligent booking, and 24/7 assistance from any browser, with future messaging integrations like WhatsApp.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo esc_url(home_url('/')); ?>">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="JetNova AI - Web-Based AI Travel Platform">
    <meta name="twitter:description" content="Transform your travel agency with a browser-based AI assistant for agencies.">
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="<?php echo get_template_directory_uri(); ?>/logo.png">
    <link rel="apple-touch-icon" href="<?php echo get_template_directory_uri(); ?>/apple-touch-icon.png">
    
    <!-- Preconnect to external resources -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    
    <!-- Theme Stylesheet -->
    <link rel="stylesheet" href="<?php echo get_stylesheet_uri(); ?>">
    
    <?php wp_head(); ?>
    
    <title><?php wp_title('|', true, 'right'); ?><?php bloginfo('name'); ?></title>
</head>
<body <?php body_class(); ?>>
    <?php wp_body_open(); ?>
    
    <!-- Header -->
    <header class="site-header">
            <div class="header-content">
                <a href="<?php echo esc_url(home_url('/')); ?>" class="logo">
                    <img src="<?php echo get_template_directory_uri(); ?>/logo.png" alt="JetNova AI" class="logo-img" style="height: 38px; width: auto; max-height: 38px;">
                </a>
        
        <nav>
            <ul class="nav-menu">
                <li><a href="#features">Features</a></li>
                <li><a href="#demo">Demo</a></li>
                <li><a href="#pricing">Pricing</a></li>
                        <li><a href="#contact">Contact</a></li>
                    </ul>
                </nav>
                
                <a href="#contact" class="cta-button">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    </svg>
            Get Started
                </a>
                
        <button class="mobile-menu-toggle" aria-label="Toggle menu">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </div>
</header>
        
        <!-- Mobile Menu -->
        <div class="mobile-menu">
            <nav class="mobile-nav">
                <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#demo">Demo</a></li>
            <li><a href="#pricing">Pricing</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
        <a href="#contact" class="btn-primary" style="margin-top: 2rem;">Get Started Free</a>
            </nav>
            </div>

<main>
    