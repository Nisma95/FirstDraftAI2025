<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" dir="{{ (app()->getLocale() == 'ar') ? 'rtl' : 'ltr' }}">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{{ __('home.title') }}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
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

<body>

    <section
        class="bg-zoom relative flex items-center justify-center bg-cover bg-center bg-no-repeat lg:bg-[url('images/firstdraft1bg.jpg')]"
        style="direction: {{ (app()->getLocale() == 'ar') ? 'rtl' : 'ltr' }}; min-height: 100vh; height: auto; background-color: transparent;">

        <!-- Mobile Version - Visible on small screens only -->
        <div
            class="lg:hidden p-6 rounded-lg text-center w-full"
            style="text-align: center;">
            <h1 class="relative overflow-hidden">
                <span class="sr-only">{{ __('home.welcome_message') }}</span>
                <div class="flex flex-wrap justify-center" id="mobile-words-container">
                    @foreach(__('home.welcome_split') as $index => $word)
                    <span class="fdHeroTX inline-block transform transition-all duration-1000 ease-out mx-1 text-base sm:text-lg mobile-word"
                        style="opacity: 0; transform: translateY(50px); transition-delay: {{ $index * 200 }}ms; cursor: default; line-height: 1.5; padding-bottom: 0.1em; margin-bottom: 0.05em;"
                        data-index="{{ $index }}"
                        ontouchstart="this.style.transform='translateY(-5px) scale(1.02)'; this.style.transition='transform 0.2s ease';"
                        ontouchend="this.style.transform='translateY(0) scale(1)'; this.style.transition='transform 0.2s ease';">{{ $word }}</span>
                    @endforeach
                </div>
            </h1>

            <div class="mt-6 px-12">
                <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="fdButton px-6 py-3 inline-flex items-center justify-center gap-2 text-sm font-medium w-[80%]"
                    id="mobile-button"
                    style="opacity: 0; transform: scaleX(0); transform-origin: center; transition: all 800ms cubic-bezier(0.25, 0.46, 0.45, 0.94); min-height: 44px;">
                    {{ __('home.start_now') }}
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </a>
            </div>
        </div>

        <!-- Desktop Version - Hidden on small screens -->
        <div
            class="hidden lg:block rounded-lg text-center"
            style="text-align: center;">
            <h1 class="relative overflow-hidden">
                <span class="sr-only">{{ __('home.welcome_message') }}</span>
                <div class="flex flex-wrap justify-center" id="desktop-words-container">
                    @foreach(__('home.welcome_split') as $index => $word)
                    <span class="fdHeroTX inline-block transform transition-all duration-1000 ease-out mx-2 lg:text-2xl xl:text-3xl desktop-word"
                        style="opacity: 0; transform: translateY(100px); transition-delay: {{ $index * 200 }}ms; cursor: default; line-height: 1.6; padding-bottom: 0.2em; margin-bottom: 0.1em;"
                        data-index="{{ $index }}"
                        onmouseenter="this.style.transform='translateY(-10px) scale(1.05)'; this.style.transition='transform 0.3s ease';"
                        onmouseleave="this.style.transform='translateY(0) scale(1)'; this.style.transition='transform 0.3s ease';">{{ $word }}</span>
                    @endforeach
                </div>
            </h1>

            <div class="mt-8">
                <a
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="fdButton px-10 inline-flex items-center gap-2"
                    id="desktop-button"
                    style="opacity: 0; transform: translateY(50px); transition-delay: 1500ms; transition: all 1000ms ease-out;">
                    {{ __('home.start_now') }}
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </a>
            </div>
        </div>
    </section>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
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
    </script>

</body>

</html>