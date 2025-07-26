<nav class="bg-white dark:bg-gray-900 shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
            {{-- الشعار --}}
            <a href="{{ route('dashboard') }}" class="text-xl font-bold text-gray-800 dark:text-white">
                موقعي
            </a>

            {{-- روابط بسيطة --}}
            <div class="space-x-4 rtl:space-x-reverse">
                <a href="{{ route('dashboard') }}" class="text-gray-600 dark:text-gray-300 hover:text-blue-500">الرئيسية</a>
                <a href="#" class="text-gray-600 dark:text-gray-300 hover:text-blue-500">من نحن</a>
                <a href="#" class="text-gray-600 dark:text-gray-300 hover:text-blue-500">تواصل</a>
                <a href="#" class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">ابدأ الآن</a>
            </div>
        </div>
    </div>
</nav>