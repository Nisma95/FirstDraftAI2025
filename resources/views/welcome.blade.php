<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" dir="{{ app()->getLocale() === 'ar' ? 'rtl' : 'ltr' }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ __('First_Draft') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

    <!-- Tailwind CSS -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <!-- Lenis Smooth Scrolling -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/lenis/1.0.19/lenis.min.js"></script>

    <style>
        body {
            font-family: 'Figtree', sans-serif;
        }

        [dir="rtl"] .fdHeroTX {
            line-height: 1.6 !important;
            padding-bottom: 0.25em;
            margin-bottom: 0.1em;
        }

        .fdHeroTX {
            font-size: 8rem !important;
            text-transform: uppercase;
            font-weight: bold;
            background: linear-gradient(90deg, #5956e9, #6077a1, #333333);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            line-height: 1.2 !important;
        }

        .dark .fdHeroTX {
            background: linear-gradient(90deg, #5956e9 0%, #6077a1 40%, #000000 70%);
            -webkit-background-clip: text;
            background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 0px 0px 2px rgb(255 255 255 / 18%);
        }

        @media (max-width: 480px) {
            .fdHeroTX {
                font-size: 3rem !important;
                line-height: 1.4 !important;
            }

            .dark .fdHeroTX {
                background: linear-gradient(90deg, #5956e9 0%, #6077a1 40%, #ffffff 70%);
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: 0px 0px 2px rgb(255 255 255 / 18%);
            }
        }

        @media (min-width: 481px) and (max-width: 768px) {
            .fdHeroTX {
                font-size: 6rem !important;
                line-height: 1.3 !important;
            }

            .dark .fdHeroTX {
                background: linear-gradient(90deg, #5956e9 0%, #6077a1 40%, #ffffff 70%);
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                text-shadow: 0px 0px 2px rgb(255 255 255 / 18%);
            }
        }

        @media (min-width: 769px) and (max-width: 1024px) {
            .fdHeroTX {
                font-size: clamp(5rem, 10vw, 5rem) !important;
                line-height: 1.2 !important;
            }
        }

        @media (hover: hover) {
            .fdHeroTX:hover {
                transform: translateY(-5px) scale(1.05);
                transition: transform 0.3s ease;
            }
        }

        .fdButton {
            background: linear-gradient(90deg, #5956e9, #6077a1, #2c2b2b);
            color: #fff;
            padding: 10px 20px;
            border: none;
            border-radius: 1rem;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 500;
            transition: all 0.3s;
            text-align: center !important;
        }

        .fdButton:hover {
            background: linear-gradient(90deg, #2c2b2b, #6077a1, #5956e9, #2c2b2b);
        }

        :root {
            --fade-value: 0.7;
        }

        .bg-zoom {
            position: relative;
            background-size: cover;
            background-position: center;
            animation: zoomOut 10s ease-in-out infinite alternate, zoomIn 10s ease-in-out infinite alternate;
            -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 25%, rgba(0, 0, 0, 1) 75%, rgba(0, 0, 0, 0) 100%);
            -webkit-mask-size: 100% 100%;
            mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 20%, rgba(0, 0, 0, 1) 88%, rgba(0, 0, 0, 0) 100%);
            mask-size: 100% 100%;
        }

        @keyframes zoomOut {
            0% {
                background-size: 110%;
            }

            100% {
                background-size: 100%;
            }
        }

        @keyframes zoomIn {
            0% {
                background-size: 100%;
            }

            100% {
                background-size: 110%;
            }
        }

        body {
            background: #f8f9fa;
            font-family: 'Arial', sans-serif;
        }
    </style>
</head>

<body class="antialiased" lang="{{ app()->getLocale() }}">

    <!-- Main Content -->
    <main class="relative min-h-screen pb-24 lg:pb-8">
        <!-- Hero Section -->
        @include('HomeComponents.hero')

    </main>

    <!-- Smooth Scrolling Script -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize smooth scrolling
            const lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smooth: true,
                direction: 'vertical',
                gestureDirection: 'vertical',
                smoothTouch: false,
            });

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }

            requestAnimationFrame(raf);

            // Store lenis instance globally for cleanup if needed
            window.lenisInstance = lenis;

            const animateElements = () => {
                const mobileWords = document.querySelectorAll('.mobile-word');
                const mobileButton = document.getElementById('mobile-button');
                const desktopWords = document.querySelectorAll('.desktop-word');
                const desktopButton = document.getElementById('desktop-button');

                setTimeout(() => {
                    mobileWords.forEach(word => {
                        word.style.opacity = '1';
                        word.style.transform = 'translateY(0)';
                    });
                    desktopWords.forEach(word => {
                        word.style.opacity = '1';
                        word.style.transform = 'translateY(0)';
                    });
                }, 300);

                const mobileButtonDelay = 300 + (mobileWords.length * 200) + 800;
                setTimeout(() => {
                    if (mobileButton) {
                        mobileButton.style.opacity = '1';
                        mobileButton.style.transform = 'scaleX(1)';
                    }
                }, mobileButtonDelay);

                setTimeout(() => {
                    if (desktopButton) {
                        desktopButton.style.opacity = '1';
                        desktopButton.style.transform = 'translateY(0)';
                    }
                }, 300);
            };

            animateElements();
        });

        // Cleanup on page unload
        window.addEventListener('beforeunload', function() {
            if (window.lenisInstance) {
                window.lenisInstance.destroy();
            }
        });
    </script>
</body>

</html>