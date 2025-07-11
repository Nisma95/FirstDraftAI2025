-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 10, 2025 at 05:01 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `firstdraftapp10052025`
--

-- --------------------------------------------------------

--
-- Table structure for table `ai_suggestions`
--

CREATE TABLE `ai_suggestions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `plan_id` bigint(20) UNSIGNED NOT NULL,
  `suggestion_type_new` enum('business','marketing','financial','operational','other') NOT NULL DEFAULT 'other',
  `suggestion_content` text NOT NULL,
  `priority` enum('low','medium','high','critical') NOT NULL DEFAULT 'medium',
  `is_implemented` tinyint(1) NOT NULL DEFAULT 0,
  `implemented_at` timestamp NULL DEFAULT NULL,
  `impact_score` int(11) DEFAULT NULL COMMENT 'Score from 1-10',
  `category` varchar(255) DEFAULT NULL,
  `related_section` varchar(255) DEFAULT NULL COMMENT 'Related business plan section',
  `action_items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`action_items`)),
  `user_feedback` text DEFAULT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `audiences`
--

CREATE TABLE `audiences` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `plan_id` bigint(20) UNSIGNED NOT NULL,
  `age_range` varchar(255) DEFAULT NULL,
  `gender` enum('male','female','both') NOT NULL DEFAULT 'both',
  `location` varchar(255) DEFAULT NULL,
  `interests` text DEFAULT NULL,
  `income_level` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `business_types`
--

CREATE TABLE `business_types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `business_type_name` varchar(255) NOT NULL,
  `business_type_image` varchar(255) DEFAULT NULL,
  `business_type_description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `business_types`
--

INSERT INTO `business_types` (`id`, `business_type_name`, `business_type_image`, `business_type_description`, `created_at`, `updated_at`) VALUES
(1, 'Product-based', 'Products.jpg', 'E.g. clothing, food, furniture, etc.', '2025-05-12 20:29:24', '2025-05-12 20:29:24'),
(2, 'Service-based', 'Services.jpg', 'Consultancy, repair, design, etc.', '2025-05-12 20:29:24', '2025-05-12 20:29:24'),
(3, 'Software-or-App', 'Software.jpg', 'Web, mobile or desktop application', '2025-05-12 20:29:24', '2025-05-12 20:29:24'),
(4, 'Hybrid', 'Hybrid.jpg', 'Both physical goods and services', '2025-05-12 20:29:24', '2025-05-12 20:29:24');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chat_messages`
--

CREATE TABLE `chat_messages` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `conversation_id` bigint(20) UNSIGNED NOT NULL,
  `role` enum('user','assistant') NOT NULL,
  `content` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `chat_messages`
--

INSERT INTO `chat_messages` (`id`, `conversation_id`, `role`, `content`, `created_at`, `updated_at`) VALUES
(4, 1, 'user', 'hey', '2025-05-11 18:22:22', '2025-05-11 18:22:22'),
(5, 1, 'assistant', 'Hello! How can I assist you today?', '2025-05-11 18:22:24', '2025-05-11 18:22:24'),
(6, 1, 'user', 'holllla love', '2025-05-11 18:22:31', '2025-05-11 18:22:31'),
(7, 1, 'assistant', 'Hola, ¿cómo estás? ¿En qué puedo ayudarte hoy?', '2025-05-11 18:22:33', '2025-05-11 18:22:33'),
(8, 1, 'user', 'arabic?', '2025-05-11 18:22:42', '2025-05-11 18:22:42'),
(9, 1, 'assistant', 'مرحبا! كيف يمكنني مساعدتك اليوم؟', '2025-05-11 18:22:43', '2025-05-11 18:22:43'),
(10, 1, 'user', 'nicee to have ya here bro', '2025-05-11 18:22:57', '2025-05-11 18:22:57'),
(11, 1, 'assistant', 'Thank you! I’m here to assist you with anything you need. How can I help you today?', '2025-05-11 18:22:58', '2025-05-11 18:22:58'),
(12, 1, 'user', 'hey', '2025-05-11 18:40:25', '2025-05-11 18:40:25'),
(13, 1, 'assistant', 'Hello! How can I assist you today?', '2025-05-11 18:40:30', '2025-05-11 18:40:30'),
(14, 1, 'user', 'hey', '2025-05-11 18:43:08', '2025-05-11 18:43:08'),
(15, 1, 'assistant', 'Hello! How can I assist you today?', '2025-05-11 18:43:09', '2025-05-11 18:43:09'),
(16, 1, 'user', 'hey', '2025-05-11 23:12:17', '2025-05-11 23:12:17'),
(17, 1, 'assistant', 'Hello! How can I assist you today?', '2025-05-11 23:12:20', '2025-05-11 23:12:20'),
(18, 1, 'user', 'what r think best name for travelling helper app?', '2025-05-11 23:13:13', '2025-05-11 23:13:13'),
(19, 1, 'assistant', 'Some potential names for a travel helper app could be:\n\n1. WanderGuide\n2. TrekMate\n3. RoamRight\n4. JourneyAssist\n5. ExploreEase\n\nUltimately, the best name for a travel helper app would depend on the specific features and target audience of the app.', '2025-05-11 23:13:15', '2025-05-11 23:13:15'),
(20, 1, 'user', 'write a description for business plan for an app thta = App for travelers help them plan and find the best of everything they need while traveling the world with find near me people and places and event to do and allow users to chat with each other and create groups to gather and find host near me or in a city am I planing to go and more services the traveler needs with free service and paid features as well', '2025-05-11 23:14:29', '2025-05-11 23:14:29'),
(21, 1, 'assistant', 'Business Plan Description:\n\nOur app is a revolutionary tool designed to enhance the travel experience for users around the world. With a focus on personalized assistance and seamless navigation, our app aims to be the ultimate companion for travelers seeking the best of everything during their journeys.\n\nKey features of our app include:\n\n1. Travel Planning: Users can easily plan their trips and find the best options for accommodations, transportation, dining, and attractions.\n\n2. Near Me Feature: Our app enables users to discover nearby people, places, and events of interest, allowing for real-time exploration and connection.\n\n3. Group Formation: Users can create or join travel groups to connect with like-minded individuals, share experiences, and embark on group adventures.\n\n4. Host Matching: Our app facilitates the search for hosts in a specific location, making it easier for travelers to find affordable and personalized accommodations.\n\n5. Chat Functionality: Users can communicate with each other, share tips, and ask for recommendations, fostering a vibrant travel community.\n\n6. Additional Services: In addition to essential features, our app offers a range of services tailored to meet the diverse needs of travelers, including itinerary planning, language translation, and emergency assistance.\n\nOur business model combines free basic services with premium paid features to cater to a wide range of users and generate sustainable revenue. By offering a comprehensive suite of tools and resources, we strive to empower travelers to make the most of their adventures and create unforgettable memories around the world.\n\nGet ready to revolutionize the way you travel with our innovative app!', '2025-05-11 23:14:32', '2025-05-11 23:14:32');

-- --------------------------------------------------------

--
-- Table structure for table `contracts`
--

CREATE TABLE `contracts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `contract_type` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `contract_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`contract_data`)),
  `file_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `status` enum('draft','completed','signed','cancelled') NOT NULL DEFAULT 'draft'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contracts`
--

INSERT INTO `contracts` (`id`, `user_id`, `title`, `contract_type`, `content`, `contract_data`, `file_path`, `created_at`, `updated_at`, `status`) VALUES
(1, 1, 'freelancing project', 'freelance', '**FREELANCE SERVICES AGREEMENT**\n\nTHIS AGREEMENT is made and entered into this day of _______, 20__, by and between __Ayman__ (hereinafter \"Client\"), and __Breezes95__ (hereinafter \"Freelancer\").\n\n**1. CONTRACT TITLE AND PARTIES INVOLVED**\n\nThis Agreement shall be referred to as the \"Freelance Services Agreement\". The parties involved in this Agreement are the Client and the Freelancer.\n\n**2. PURPOSE AND SCOPE OF THE AGREEMENT**\n\nThe purpose of this Agreement is to set forth the terms and conditions under which the Freelancer agrees to provide services to the Client. The scope of the services to be provided by the Freelancer includes the development of a first draft application using larval and react web app (the \"Services\").\n\n**3. TERMS AND CONDITIONS**\n\nThe Freelancer agrees to perform the Services in a professional and timely manner, in accordance with the specifications provided by the Client. The Freelancer shall provide all necessary equipment, tools, and other materials at his/her own expense.\n\n**4. PAYMENT TERMS**\n\nThe Client agrees to pay the Freelancer a total fee of $2000 for the Services. Payment shall be made upon completion of the Services, but no later than June 30, 2025.\n\n**5. DURATION AND TERMINATION CLAUSES**\n\nThis Agreement shall commence on the date first above written and shall continue until the Services are completed and accepted by the Client, or until terminated by either party. Either party may terminate this Agreement at any time, with or without cause, upon written notice to the other party.\n\n**6. RESPONSIBILITIES OF EACH PARTY**\n\nThe Freelancer is responsible for the performance of the Services, and the Client is responsible for making timely payments to the Freelancer. Each party agrees to perform its obligations in good faith and in a professional manner.\n\n**7. LEGAL PROVISIONS AND GOVERNING LAW**\n\nThis Agreement shall be governed by and construed in accordance with the laws of the state in which the Client is located. Any disputes arising out of this Agreement shall be resolved by arbitration in the same state.\n\n**8. SIGNATURE SECTIONS**\n\nIN WITNESS WHEREOF, the parties hereto have executed this Freelance Services Agreement as of the date first above written.\n\n______________________          ______________________\nAyman (Client)                          Breezes95 (Freelancer)\n\n______________________          ______________________\nDate                                          Date\n\nThis Agreement may be executed in counterparts, each of which shall be deemed an original, but all of which together shall constitute one and the same instrument.', '{\"freelancer_name\":\"Breezes95\",\"client_name\":\"Ayman\",\"project_description\":\"first draft app\",\"payment_amount\":\"2000\",\"deadline\":\"2025-06-30\",\"deliverables\":\"larval and react web app\"}', 'contracts/1_1748358194.pdf', '2025-05-27 07:03:14', '2025-05-27 07:03:14', 'draft'),
(2, 1, 'freelancing project', 'freelance', '**FREELANCE SERVICES AGREEMENT**\n\nTHIS AGREEMENT is made and entered into this ____ day of ____, 20__, by and between Ayman (hereinafter \"Client\"), and Breezes95 (hereinafter \"Freelancer\").\n\n**1. PURPOSE AND SCOPE OF THE AGREEMENT**\n\nThe purpose of this Agreement is for the Freelancer to provide professional services to the Client for the development of a first draft application, specifically a larval and react web app (the \"Project\"). The specific services to be provided, the deliverables, and the timeline for the Project are as set forth in Exhibit A, attached hereto and incorporated by reference.\n\n**2. TERMS AND CONDITIONS**\n\nThe Freelancer agrees to perform the services and deliver the deliverables as described in Exhibit A in a professional and timely manner. The Freelancer shall be an independent contractor and not an employee of the Client. The Freelancer shall have no authority to bind or commit the Client. Nothing herein shall be deemed to create a partnership, joint venture, or agency relationship between the parties.\n\n**3. PAYMENT TERMS**\n\nIn consideration of the services to be performed by Freelancer, Client agrees to pay Freelancer a total fee of $2000. Payment shall be made in accordance with the schedule set forth in Exhibit B, attached hereto and incorporated by reference.\n\n**4. DURATION AND TERMINATION**\n\nThis Agreement shall commence on the date first above written and shall continue until June 30, 2025, unless earlier terminated as provided herein. Either party may terminate this Agreement upon written notice if the other party breaches any material term or condition of this Agreement and fails to cure such breach within 30 days of receipt of written notice of the same.\n\n**5. RESPONSIBILITIES OF EACH PARTY**\n\nThe Freelancer shall be responsible for the performance of the services and the delivery of the deliverables as described in Exhibit A. The Client shall be responsible for providing the Freelancer with the information, access, and resources necessary to perform the services.\n\n**6. LEGAL PROVISIONS AND GOVERNING LAW**\n\nThis Agreement shall be governed by and construed in accordance with the laws of the state in which the Client is located. The parties agree to submit to the exclusive jurisdiction of the courts of that state. This Agreement contains the entire understanding of the parties and supersedes all prior understandings and agreements, whether written or oral, relating to the subject matter hereof.\n\n**7. SIGNATURES**\n\nIN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the date first above written.\n\n__________________________          __________________________\nAyman (Client)                                     Breezes95 (Freelancer)\n\n**EXHIBIT A**\n\n**DESCRIPTION OF SERVICES AND DELIVERABLES**\n\nThe Freelancer will develop a first draft application, specifically a larval and react web app. The specific services to be provided, the deliverables, and the timeline for the Project will be as agreed upon by the parties.\n\n**EXHIBIT B**\n\n**PAYMENT SCHEDULE**\n\nThe total fee of $2000 will be paid in installments as follows: 50% upon execution of this Agreement and 50% upon completion of the Project.', '{\"freelancer_name\":\"Breezes95\",\"client_name\":\"Ayman\",\"project_description\":\"first draft app\",\"payment_amount\":\"2000\",\"deadline\":\"2025-06-30\",\"deliverables\":\"larval and react web app\"}', 'contracts/2_1748358244.pdf', '2025-05-27 07:04:04', '2025-05-27 07:04:04', 'draft'),
(3, 1, 'freelancing project', 'freelance', '**FREELANCE SERVICES AGREEMENT**\n\nTHIS AGREEMENT is made and entered into this ______ day of ___________, 20______ (the \"Effective Date\"), by and between:\n\n**CLIENT**\nName: Ayman\n(the \"Client\")\n\nAND\n\n**FREELANCER**\nName: Breezes95\n(the \"Freelancer\")\n\n**1. PURPOSE AND SCOPE OF THE AGREEMENT**\n\nThe purpose of this Agreement is to set forth the terms and conditions under which the Freelancer will provide services to the Client for the development of a first draft app, specifically a larval and react web app (the \"Project\").\n\n**2. TERMS AND CONDITIONS**\n\nThe Freelancer agrees to provide the services as described in Exhibit A attached hereto. The Freelancer shall perform the services in a professional and diligent manner, on or before the deadline specified in Section 5.\n\n**3. PAYMENT TERMS**\n\nThe Client agrees to pay the Freelancer a total fee of $2000 for the completion of the Project. Payment shall be made in accordance with the schedule set forth in Exhibit B attached hereto.\n\n**4. DURATION AND TERMINATION**\n\nThis Agreement shall commence on the Effective Date and shall continue until June 30, 2025, unless earlier terminated as provided herein. Either party may terminate this Agreement upon providing written notice to the other party.\n\n**5. RESPONSIBILITIES OF EACH PARTY**\n\nThe Freelancer shall be responsible for the timely delivery of the Project, and the Client shall be responsible for providing timely feedback and payment in accordance with the terms of this Agreement.\n\n**6. LEGAL PROVISIONS AND GOVERNING LAW**\n\nThis Agreement shall be governed by and construed in accordance with the laws of the state in which the Client is located. Each party agrees to submit to the jurisdiction of the courts of such state in any action or proceeding arising out of or relating to this Agreement.\n\n**7. SIGNATURES**\n\nIN WITNESS WHEREOF, the parties hereto have executed this Freelance Services Agreement as of the Effective Date.\n\n__________________________      __________________________\nAyman (Client)                              Breezes95 (Freelancer)\n\n**EXHIBIT A – SCOPE OF WORK**\n\nThe Freelancer shall develop a first draft app, specifically a larval and react web app, in accordance with the specifications provided by the Client.\n\n**EXHIBIT B – PAYMENT SCHEDULE**\n\nThe Client shall pay the Freelancer a total fee of $2000, payable in installments as follows: 50% upon commencement of the Project, and 50% upon completion of the Project.\n', '{\"freelancer_name\":\"Breezes95\",\"client_name\":\"Ayman\",\"project_description\":\"first draft app\",\"payment_amount\":\"2000\",\"deadline\":\"2025-06-30\",\"deliverables\":\"larval and react web app\"}', 'contracts/3_1748358287.pdf', '2025-05-27 07:04:47', '2025-05-27 07:04:47', 'draft'),
(4, 1, 'freelancing project', 'freelance', '**FREELANCE SERVICES AGREEMENT**\n\nTHIS AGREEMENT is made and entered into this ______ day of ________, 20______, by and between **Ayman** (hereinafter \"Client\"), and **Breezes95** (hereinafter \"Freelancer\").\n\n**1. PURPOSE AND SCOPE OF THE AGREEMENT**\n\nThe purpose of this Agreement is to provide for the performance of freelance services by the Freelancer for the Client. The Freelancer shall develop a first draft application using larval and react web app (the \"Project\"). The specific tasks, deliverables, and timeline for the Project are as set forth in Exhibit A, attached hereto and incorporated herein by reference.\n\n**2. TERMS AND CONDITIONS**\n\nThe Freelancer agrees to perform the services and deliver the results as described in Exhibit A in a professional and timely manner. The Freelancer shall be responsible for all costs and expenses related to the performance of the services unless otherwise specified in Exhibit A.\n\n**3. PAYMENT TERMS**\n\nIn consideration for the services to be performed by Freelancer, Client agrees to pay Freelancer a total fee of $2000. Payment shall be made in accordance with the schedule set forth in Exhibit B, attached hereto and incorporated herein by reference.\n\n**4. DURATION AND TERMINATION**\n\nThis Agreement shall commence on the date first above written and shall continue until June 30, 2025, unless earlier terminated as provided herein. Either party may terminate this Agreement upon providing the other party with written notice of such termination.\n\n**5. RESPONSIBILITIES OF EACH PARTY**\n\nThe Freelancer shall perform the services and deliver the results as described in Exhibit A. The Client shall provide the Freelancer with all necessary information and materials to perform the services and shall cooperate with the Freelancer as necessary to complete the Project.\n\n**6. LEGAL PROVISIONS AND GOVERNING LAW**\n\nThis Agreement shall be governed by and construed in accordance with the laws of the state of ___________. Any disputes arising under or in connection with this Agreement shall be subject to the exclusive jurisdiction of the state and federal courts located within the state of ___________.\n\n**7. SIGNATURES**\n\nIN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the date first above written.\n\n__________________________      __________________________\nAyman (Client)                             Breezes95 (Freelancer)\n\n**EXHIBIT A – PROJECT DESCRIPTION AND DELIVERABLES**\n\n**EXHIBIT B – PAYMENT SCHEDULE**\n', '{\"freelancer_name\":\"Breezes95\",\"client_name\":\"Ayman\",\"project_description\":\"first draft app\",\"payment_amount\":\"2000\",\"deadline\":\"2025-06-30\",\"deliverables\":\"larval and react web app\"}', 'contracts/4_1748358317.pdf', '2025-05-27 07:05:17', '2025-05-27 07:05:17', 'draft'),
(5, 1, 'freelancing project', 'freelance', '**FREELANCE SERVICES AGREEMENT**\n\nTHIS AGREEMENT is made and entered into this ______ day of ________, 20______, by and between Ayman (hereinafter \"Client\"), and Breezes95 (hereinafter \"Freelancer\").\n\n**1. PURPOSE AND SCOPE OF THE AGREEMENT**\n\nThe purpose of this Agreement is to set forth the terms and conditions under which Freelancer will provide services to Client for the development of a first draft application, specifically a larval and react web app (hereinafter \"the Project\").\n\n**2. TERMS AND CONDITIONS**\n\nFreelancer agrees to provide the services and deliverables as described in Exhibit A attached hereto. The services shall be performed in a professional and workmanlike manner, in accordance with industry standards.\n\n**3. PAYMENT TERMS**\n\nIn consideration for the services to be provided by Freelancer, Client agrees to pay Freelancer a total fee of $2000. Payment shall be made in accordance with the schedule set forth in Exhibit B attached hereto.\n\n**4. DURATION AND TERMINATION**\n\nThis Agreement shall commence on the date first above written and shall continue in full force and effect until June 30, 2025, unless earlier terminated as provided herein. Either party may terminate this Agreement upon providing written notice to the other party.\n\n**5. RESPONSIBILITIES OF EACH PARTY**\n\nFreelancer shall be responsible for the performance of all tasks specified in this Agreement, and the timely delivery of all deliverables as specified in Exhibit A. Client shall provide all necessary information and assistance required for Freelancer to perform the services.\n\n**6. LEGAL PROVISIONS AND GOVERNING LAW**\n\nThis Agreement shall be governed by and construed in accordance with the laws of the state of ________. Any disputes arising out of this Agreement shall be resolved in the state or federal courts of ________.\n\n**7. SIGNATURES**\n\nIN WITNESS WHEREOF, the parties hereto have executed this Freelance Services Agreement as of the date first above written.\n\n___________________________      ___________________________\nAyman (Client)                             Breezes95 (Freelancer)\n\n**EXHIBIT A – SCOPE OF WORK**\n\nFreelancer shall develop a first draft application, specifically a larval and react web app, in accordance with the specifications provided by Client.\n\n**EXHIBIT B – PAYMENT SCHEDULE**\n\nPayment of $2000 shall be made upon completion of the Project and acceptance by Client.\n\nThis Agreement constitutes the entire agreement between the parties with respect to the subject matter hereof and supersedes all prior agreements, understandings, and negotiations, both written and oral, between the parties with respect to the subject matter of this Agreement.', '{\"freelancer_name\":\"Breezes95\",\"client_name\":\"Ayman\",\"project_description\":\"first draft app\",\"payment_amount\":\"2000\",\"deadline\":\"2025-06-30\",\"deliverables\":\"larval and react web app\"}', 'contracts/5_1748358401.pdf', '2025-05-27 07:06:41', '2025-05-27 07:06:42', 'draft'),
(6, 1, 'freelancing project', 'freelance', '**FREELANCE SERVICES AGREEMENT**\n\nTHIS AGREEMENT is made and entered into this ______ day of ___________, 20_____, by and between Ayman, hereinafter referred to as \"Client\", and Breezes95, hereinafter referred to as \"Freelancer\".\n\n**1. PURPOSE AND SCOPE OF THE AGREEMENT**\n\nThe purpose of this Agreement is to provide for the performance of freelance web app development services by Freelancer for Client. The specific services to be performed are described in the \"Project Description\" and \"Deliverables\" sections of this Agreement.\n\n**2. PROJECT DESCRIPTION AND DELIVERABLES**\n\nFreelancer agrees to develop the first draft of a web app for Client. The specific deliverables shall be the first draft of the web app, as described in more detail in any attachments or exhibits to this Agreement.\n\n**3. TERMS AND CONDITIONS**\n\nFreelancer agrees to perform the services and deliver the deliverables in a professional and timely manner, in accordance with the standards of the industry. Freelancer shall provide all necessary equipment, materials, and software necessary to perform the services.\n\n**4. PAYMENT TERMS**\n\nClient agrees to pay Freelancer a total fee of $2000 for the services and deliverables provided under this Agreement. Payment shall be made upon completion of the services and acceptance of the deliverables by Client.\n\n**5. DURATION AND TERMINATION**\n\nThis Agreement shall commence upon the date first above written and shall continue until June 30, 2025, unless earlier terminated by either party. Either party may terminate this Agreement upon 30 days written notice to the other party.\n\n**6. RESPONSIBILITIES OF EACH PARTY**\n\nFreelancer shall be responsible for the performance of the services and the delivery of the deliverables. Client shall be responsible for providing Freelancer with all necessary information and materials to perform the services and create the deliverables.\n\n**7. LEGAL PROVISIONS AND GOVERNING LAW**\n\nThis Agreement shall be governed by and construed in accordance with the laws of the state in which Client is located. Any disputes arising out of this Agreement shall be resolved in the courts of that state.\n\n**8. SIGNATURES**\n\nIN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the date first above written.\n\n__________________________        __________________________\nBreezes95 (Freelancer)            Ayman (Client)\n\nThis Agreement may be executed in counterparts, each of which shall be deemed an original, but all of which together shall constitute one and the same instrument. The parties confirm that all discussions relating to this Agreement have been conducted in the English language and that they have requested that this Agreement be drawn up in English only.', '{\"freelancer_name\":\"Breezes95\",\"client_name\":\"Ayman\",\"payment_amount\":\"2000\",\"project_description\":\"firat draft web app development\",\"deliverables\":\"firat draft web app development\",\"deadline\":\"2025-06-30\"}', 'contracts/6_1748358575.pdf', '2025-05-27 07:09:35', '2025-05-27 07:09:35', 'draft'),
(7, 1, 'First Draft contarct', 'freelance', '**FREELANCE SERVICES AGREEMENT**\n\nTHIS AGREEMENT is made and entered into this ______ day of ________, 20______, by and between __Ayman__ (hereinafter \"Client\"), and __Breezes95__ (hereinafter \"Freelancer\").\n\n**1. PURPOSE AND SCOPE OF THE AGREEMENT**\n\nThe purpose of this Agreement is to set forth the terms and conditions under which Freelancer will provide services to Client for the development of a first draft web application using Laravel and React (the \"Project\"). \n\n**2. TERMS AND CONDITIONS**\n\n2.1 Freelancer agrees to develop the Project according to the specifications provided by the Client. The final deliverable will be a custom web application built using Laravel and React.\n\n2.2 Freelancer will provide the Client with regular updates on the progress of the Project.\n\n2.3 Freelancer agrees to complete the Project by June 7, 2025.\n\n**3. PAYMENT TERMS**\n\n3.1 The Client agrees to pay Freelancer a total fee of $2000 for the completion of the Project.\n\n3.2 Payment will be made in two installments: 50% upon commencement of the Project and 50% upon completion.\n\n**4. DURATION AND TERMINATION**\n\n4.1 This Agreement will commence on the date it is signed by both parties and will continue until the Project is completed and accepted by the Client, or until terminated by either party.\n\n4.2 Either party may terminate this Agreement at any time, with or without cause, upon giving the other party 30 days written notice.\n\n**5. RESPONSIBILITIES OF EACH PARTY**\n\n5.1 Freelancer is responsible for providing the services and delivering the Project as specified in this Agreement.\n\n5.2 Client is responsible for providing all necessary information and materials to Freelancer and for making payments as specified in this Agreement.\n\n**6. LEGAL PROVISIONS AND GOVERNING LAW**\n\n6.1 This Agreement shall be governed by and construed in accordance with the laws of the state in which the Client is located.\n\n6.2 Any dispute arising out of or in connection with this Agreement shall be resolved by arbitration in accordance with the rules of the American Arbitration Association.\n\n**7. SIGNATURES**\n\nIN WITNESS WHEREOF, the parties hereto have executed this Agreement as of the date first above written.\n\n__________________________     __________________________\nAyman (Client)                             Breezes95 (Freelancer)\n\n__________________________     __________________________\nDate                                              Date\n', '{\"freelancer_name\":\"Breezes95\",\"client_name\":\"Ayman\",\"project_description\":\"first draft web app\",\"payment_amount\":\"2000\",\"deliverables\":\"Laravel and react custom web app\",\"deadline\":\"2025-06-07\"}', 'contracts/7_1748413654.pdf', '2025-05-27 22:27:31', '2025-05-27 22:27:40', 'draft'),
(8, 1, 'contract pdf', 'freelance', '**FREELANCE SERVICES AGREEMENT**\n\n**THIS AGREEMENT** is made and entered into this day of ________, 20______, by and between **Ayman** (hereinafter referred to as the \"Client\"), and **Breezes95** (hereinafter referred to as the \"Freelancer\").\n\n**1. PURPOSE AND SCOPE OF THE AGREEMENT**\n\nThe Client hereby engages the Freelancer to provide services in connection with the Client’s project of creating a contract pdf (the \"Project\"). The Freelancer hereby agrees to provide such services to the Client.\n\n**2. TERMS AND CONDITIONS**\n\nThe Freelancer shall deliver the final product of the Project to the Client on or before the 7th day of June, 2025. The final product shall be delivered in the form of a contract pdf (the \"Deliverables\").\n\n**3. PAYMENT TERMS**\n\nThe Client shall pay the Freelancer a total fee of $2000 for the Project. Payment shall be made upon completion of the Project, and upon receipt by the Client of an invoice from the Freelancer.\n\n**4. DURATION AND TERMINATION**\n\nThis Agreement shall commence upon the date first above written and shall continue until the completion of the Project, unless earlier terminated as provided herein. Either party may terminate this Agreement at any time, with or without cause, upon giving the other party written notice of termination.\n\n**5. RESPONSIBILITIES OF EACH PARTY**\n\nThe Freelancer shall perform the services under this Agreement using reasonable care and skill and in accordance with generally recognized commercial practices and standards. The Client shall provide such access to its information as may be reasonably required in order to allow the Freelancer to perform the services.\n\n**6. LEGAL PROVISIONS AND GOVERNING LAW**\n\nThis Agreement shall be governed by and construed in accordance with the laws of the state in which the Client is located. Any disputes arising out of this Agreement shall be subject to the exclusive jurisdiction of the courts of that state.\n\n**7. ENTIRE AGREEMENT**\n\nThis Agreement contains the entire agreement between the parties relating to the subject matter hereof and supersedes any and all prior agreements or understandings, written or oral, between the parties related to the subject matter hereof.\n\n**IN WITNESS WHEREOF**, the parties hereto have executed this Agreement as of the date first above written.\n\n__________________________       __________________________\nAyman (Client)                             Breezes95 (Freelancer)\n\n__________________________       __________________________\nDate                                               Date\n', '{\"freelancer_name\":\"Breezes95\",\"client_name\":\"Ayman\",\"payment_amount\":\"2000\",\"project_description\":\"contract pdf\",\"deliverables\":\"contract pdf\",\"deadline\":\"2025-06-07\"}', 'contracts/8_1748415152.pdf', '2025-05-27 22:52:31', '2025-05-27 22:52:36', 'draft'),
(9, 1, 'contract pdf', 'freelance', '**FREELANCE SERVICES AGREEMENT**\n\nTHIS AGREEMENT is made and entered into this day of _______, 20__, by and between Ayman (hereinafter \"Client\"), and Breezes95 (hereinafter \"Freelancer\").\n\n**1. PURPOSE AND SCOPE OF THE AGREEMENT**\n\nThe purpose of this Agreement is to set forth the terms and conditions under which Freelancer will provide services to Client. The services to be provided under this Agreement are described in the Project Description and Deliverables section below.\n\n**2. PROJECT DESCRIPTION AND DELIVERABLES**\n\nFreelancer agrees to provide services to Client in the form of creating a contract in PDF format (hereinafter \"the Project\"). The deliverables for the Project shall be a contract in PDF format.\n\n**3. TERMS AND CONDITIONS**\n\nFreelancer agrees to complete the Project by the deadline of June 7, 2025. Freelancer shall provide the Deliverables in a professional and timely manner, in accordance with the standards of the industry.\n\n**4. PAYMENT TERMS**\n\nIn consideration for the services to be provided by Freelancer, Client agrees to pay Freelancer a total fee of $2000. Payment shall be made upon completion of the Project and delivery of the Deliverables to Client.\n\n**5. DURATION AND TERMINATION**\n\nThis Agreement shall commence on the date first above written and shall continue until the completion of the Services unless earlier terminated as provided herein. Either party may terminate this Agreement upon written notice if the other party breaches any material term or condition of this Agreement and fails to cure such breach within 30 days of receipt of written notice.\n\n**6. RESPONSIBILITIES OF EACH PARTY**\n\nFreelancer shall be responsible for the performance of the Services and shall provide its own equipment, tools, and other resources necessary to complete the Project. Client shall provide Freelancer with the information and materials necessary for Freelancer to perform the Services.\n\n**7. LEGAL PROVISIONS AND GOVERNING LAW**\n\nThis Agreement shall be governed by and construed in accordance with the laws of the state in which Client is located. Each party agrees to submit to the jurisdiction of the courts of such state in any action or proceeding arising out of or relating to this Agreement.\n\n**8. SIGNATURES**\n\nIN WITNESS WHEREOF, the parties hereto have executed this Freelance Services Agreement as of the date first above written.\n\n______________________        ______________________\nBreezes95 (Freelancer)        Ayman (Client)\n\nDate: ________                 Date: ________\n\nThis Agreement may be executed in counterparts, each of which shall be deemed an original, but all of which together shall constitute one and the same instrument.', '{\"freelancer_name\":\"Breezes95\",\"client_name\":\"Ayman\",\"payment_amount\":\"2000\",\"project_description\":\"contract pdf\",\"deliverables\":\"contract pdf\",\"deadline\":\"2025-06-07\"}', 'contracts/9_1748415194.pdf', '2025-05-27 22:53:14', '2025-05-27 22:53:17', 'draft'),
(10, 1, 'contract pdf', 'freelance', '**FREELANCE SERVICES AGREEMENT**\n\n**THIS AGREEMENT** is made and entered into this day of _______, 20__, by and between **Contract PDF** (hereinafter \"Client\"), and **Contract PDF** (hereinafter \"Freelancer\").\n\n**1. PURPOSE AND SCOPE OF THE AGREEMENT**\n\nThe purpose of this Agreement is to provide a written understanding of the services to be performed by Freelancer for Client. Freelancer agrees to provide services for the project described as \"Contract PDF\" (hereinafter \"Project\"). The specific deliverables and deadline for this Project are as outlined in Section 3.\n\n**2. TERMS AND CONDITIONS**\n\nFreelancer agrees to perform the services outlined in this Agreement with professionalism, care, skill, and diligence, in accordance with the standards of the industry. Freelancer agrees to provide all necessary materials and equipment to complete the Project.\n\n**3. PROJECT DELIVERABLES AND DEADLINE**\n\nThe deliverables for the Project are as described as \"Contract PDF\". The deadline for completion of the Project is June 7, 2025.\n\n**4. PAYMENT TERMS**\n\nIn consideration for the services to be performed by Freelancer, Client agrees to pay Freelancer a total fee of $2000. Payment shall be made in full upon completion of the Project.\n\n**5. DURATION AND TERMINATION**\n\nThis Agreement shall commence on the date first above written and shall continue until the completion of the Project, unless earlier terminated as provided herein. Either party may terminate this Agreement upon providing written notice to the other party.\n\n**6. RESPONSIBILITIES OF EACH PARTY**\n\nFreelancer is responsible for the timely and professional completion of the Project as outlined in this Agreement. Client is responsible for providing Freelancer with all necessary information and materials needed to complete the Project, and for timely payment as outlined in Section 4.\n\n**7. LEGAL PROVISIONS AND GOVERNING LAW**\n\nThis Agreement shall be governed by and construed in accordance with the laws of the state in which Client is located. Any disputes arising out of this Agreement shall be resolved in the state in which Client is located.\n\n**8. SIGNATURES**\n\nBy signing below, both parties agree to the terms and conditions outlined in this Agreement.\n\n__________________________        __________________________\nContract PDF (Freelancer)         Date\n\n__________________________        __________________________\nContract PDF (Client)             Date\n\nThis Agreement constitutes the entire agreement between the parties and supersedes all prior discussions, negotiations, and agreements, whether oral or written.', '{\"freelancer_name\":\"contract pdf\",\"client_name\":\"contract pdf\",\"payment_amount\":\"2000\",\"project_description\":\"contract pdf\",\"deliverables\":\"contract pdf\",\"deadline\":\"2025-06-07\"}', 'contracts/10_1748420909.pdf', '2025-05-27 22:55:46', '2025-05-28 00:28:30', 'draft');

-- --------------------------------------------------------

--
-- Table structure for table `conversations`
--

CREATE TABLE `conversations` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `conversations`
--

INSERT INTO `conversations` (`id`, `user_id`, `title`, `created_at`, `updated_at`) VALUES
(1, 1, 'hey', '2025-05-11 18:15:57', '2025-05-11 23:14:32'),
(2, 1, NULL, '2025-05-11 18:41:00', '2025-05-11 18:41:00'),
(3, 1, NULL, '2025-05-12 22:20:58', '2025-05-12 22:20:58');

-- --------------------------------------------------------

--
-- Table structure for table `finances`
--

CREATE TABLE `finances` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `plan_id` bigint(20) UNSIGNED NOT NULL,
  `initial_budget` decimal(15,2) DEFAULT NULL,
  `expected_income` decimal(15,2) DEFAULT NULL,
  `monthly_expenses` decimal(15,2) DEFAULT NULL,
  `profit_estimate` decimal(15,2) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `goals`
--

CREATE TABLE `goals` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `plan_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `priority` enum('low','medium','high') NOT NULL DEFAULT 'medium',
  `due_date` date DEFAULT NULL,
  `status` enum('pending','in_progress','completed') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `industries`
--

CREATE TABLE `industries` (
  `id` int(10) UNSIGNED NOT NULL,
  `industry_name` varchar(100) NOT NULL,
  `industry_description` text DEFAULT NULL,
  `industry_image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `industries`
--

INSERT INTO `industries` (`id`, `industry_name`, `industry_description`, `industry_image`, `created_at`, `updated_at`) VALUES
(1, 'Technology/Software', 'mobile apps, SaaS platforms, AI/ML services, e-commerce websites, and fintech solutions', 'technology.webp', '2025-01-07 16:15:10', '2025-01-07 16:15:10'),
(2, 'Food & Beverage', 'cafes, food trucks, catering services, meal delivery, and specialty food products', 'Food.webp', '2025-01-07 16:15:10', '2025-01-07 16:15:10'),
(3, 'Health & Wellness', 'fitness centers, wellness clinics, mental health services, nutritional consulting, and personal training.', 'Health.webp', '2025-01-07 16:15:10', '2025-01-07 16:15:10'),
(4, 'Pets', 'pet grooming services, veterinary clinics, pet training, pet boarding, pet products, and pet accessories', 'Pets.webp', '2025-05-12 20:37:12', '2025-05-12 20:37:12'),
(5, 'Retail & E-commerce', 'online stores, fashion retailers, electronics shops, marketplace platforms, and specialty retail businesses', NULL, '2025-05-29 00:38:31', '2025-05-29 00:38:31'),
(6, 'Education & Training', 'online courses, tutoring services, educational platforms, skill development programs, and academic institutions', NULL, '2025-05-29 00:38:31', '2025-05-29 00:38:31'),
(7, 'Real Estate', 'property management, real estate agencies, rental platforms, property development, and real estate investment services', NULL, '2025-05-29 00:38:31', '2025-05-29 00:38:31'),
(8, 'Finance & Insurance', 'financial planning, insurance services, investment platforms, accounting firms, and fintech solutions', NULL, '2025-05-29 00:38:31', '2025-05-29 00:38:31'),
(9, 'Entertainment & Media', 'content creation, streaming services, gaming, event planning, music production, and digital media platforms', NULL, '2025-05-29 00:38:31', '2025-05-29 00:38:31'),
(10, 'Travel & Tourism', 'travel agencies, booking platforms, tour operators, hospitality services, and travel planning tools', NULL, '2025-05-29 00:38:31', '2025-05-29 00:38:31'),
(11, 'Automotive', 'car dealerships, auto repair services, car rental, automotive parts, and vehicle maintenance platforms', NULL, '2025-05-29 00:38:31', '2025-05-29 00:38:31'),
(12, 'Home & Garden', 'home improvement, landscaping services, interior design, home security, and garden maintenance', NULL, '2025-05-29 00:38:31', '2025-05-29 00:38:31'),
(13, 'Consulting & Professional Services', 'business consulting, management consulting, strategy consulting, professional advisory services', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(14, 'Legal Services', 'law firms, legal consulting, contract services, intellectual property, legal advice platforms', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(15, 'Accounting & Tax Services', 'bookkeeping, tax preparation, payroll services, financial auditing, accounting software', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(16, 'Marketing & Advertising', 'digital marketing, social media marketing, advertising agencies, content marketing, SEO services', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(17, 'Medical & Healthcare', 'hospitals, clinics, medical practices, telemedicine, medical devices, healthcare technology', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(18, 'Dental Services', 'dental clinics, orthodontics, dental hygiene, dental equipment, oral health services', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(19, 'Mental Health & Therapy', 'counseling services, therapy practices, mental health platforms, wellness coaching', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(20, 'Pharmacy & Medical Supplies', 'pharmacies, medical equipment, pharmaceutical services, medical supply distribution', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(21, 'Beauty & Cosmetics', 'beauty salons, cosmetics, skincare products, makeup services, beauty e-commerce', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(22, 'Hair & Nail Services', 'hair salons, barbershops, nail salons, beauty treatments, personal grooming', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(23, 'Spa & Wellness', 'day spas, massage therapy, wellness centers, relaxation services, holistic health', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(24, 'Construction & Contracting', 'general contracting, home building, renovation, construction management, building services', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(25, 'Manufacturing & Production', 'product manufacturing, industrial production, custom manufacturing, assembly services', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(26, 'Architecture & Design', 'architectural services, interior design, landscape design, engineering design, CAD services', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(27, 'Transportation & Delivery', 'shipping services, courier services, logistics, freight transport, delivery platforms', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(28, 'Automotive Services', 'auto repair, car maintenance, automotive parts, vehicle inspection, auto detailing', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(29, 'Restaurants & Cafes', 'restaurants, cafes, fast food, fine dining, food delivery, catering services', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(30, 'Food Production & Manufacturing', 'food processing, beverage manufacturing, specialty food products, commercial kitchen services', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(31, 'Fashion & Clothing', 'clothing stores, fashion design, apparel manufacturing, fashion e-commerce, accessories', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(32, 'Electronics & Technology Retail', 'electronics stores, computer sales, mobile devices, tech accessories, gadget retail', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(33, 'Sports & Recreation', 'sporting goods, fitness equipment, recreational activities, sports coaching, outdoor gear', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(34, 'Arts & Crafts', 'art supplies, craft stores, handmade products, creative workshops, artistic services', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(35, 'Cleaning Services', 'residential cleaning, commercial cleaning, specialized cleaning, janitorial services', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(36, 'Security Services', 'security systems, private security, surveillance, alarm systems, safety consulting', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(37, 'Repair & Maintenance', 'appliance repair, equipment maintenance, handyman services, technical repair', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(38, 'Agriculture & Farming', 'crop production, livestock, agricultural equipment, farm management, organic farming', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(39, 'Environmental Services', 'waste management, recycling, environmental consulting, green energy, sustainability services', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(40, 'Landscaping & Gardening', 'landscape design, garden maintenance, lawn care, tree services, outdoor maintenance', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(41, 'Event Planning & Management', 'wedding planning, corporate events, party planning, event coordination, venue management', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(42, 'Photography & Videography', 'professional photography, video production, wedding photography, commercial photography', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(43, 'Music & Audio', 'music production, audio services, recording studios, sound engineering, music lessons', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(44, 'Translation & Language Services', 'translation services, language learning, interpretation, localization, language consulting', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(45, 'Pet Services', 'pet grooming, veterinary services, pet boarding, pet training, pet supplies, animal care', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(46, 'Senior Care Services', 'elderly care, assisted living, home healthcare, senior services, geriatric care', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(47, 'Childcare & Education', 'daycare services, preschools, tutoring, educational services, child development', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(48, 'Software Development', 'custom software, mobile apps, web development, software consulting, programming services', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(49, 'IT Services & Support', 'computer repair, IT consulting, network services, cybersecurity, technical support', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(50, 'Digital Marketing & SEO', 'search engine optimization, social media management, online advertising, digital strategy', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14'),
(51, 'Other', 'Industries not listed above - please specify your industry type', NULL, '2025-05-29 00:43:14', '2025-05-29 00:43:14');

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `queue`, `payload`, `attempts`, `reserved_at`, `available_at`, `created_at`) VALUES
(1, 'business-plans', '{\"uuid\":\"98dd1036-4f65-467f-a611-1164153e077f\",\"displayName\":\"App\\\\Jobs\\\\GenerateBusinessPlan\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":300,\"retryUntil\":null,\"data\":{\"commandName\":\"App\\\\Jobs\\\\GenerateBusinessPlan\",\"command\":\"O:29:\\\"App\\\\Jobs\\\\GenerateBusinessPlan\\\":7:{s:7:\\\"\\u0000*\\u0000plan\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\Plan\\\";s:2:\\\"id\\\";i:21;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:10:\\\"\\u0000*\\u0000answers\\\";a:4:{i:0;a:4:{s:8:\\\"question\\\";s:71:\\\"What will be the primary revenue streams for the \'nsoom633\' travel app?\\\";s:13:\\\"question_type\\\";s:4:\\\"text\\\";s:6:\\\"answer\\\";s:410:\\\"Primary revenue streams for nsoom633 travel app:\\n\\nCommission fees from hotel and flight bookings (8-12%)\\nSubscription plans for premium features ($9.99\\/month)\\nIn-app advertising from travel brands and local businesses\\nExperience booking commissions (tours, activities, restaurants)\\nCurrency exchange service fees (2-3% markup)\\n\\nThese diversified streams ensure stable income while providing value to travelers.\\\";s:9:\\\"timestamp\\\";s:24:\\\"2025-05-15T07:43:05.743Z\\\";}i:1;a:4:{s:8:\\\"question\\\";s:132:\\\"What strategies will be implemented to attract travel brands and local businesses for in-app advertising on the nsoom633 travel app?\\\";s:13:\\\"question_type\\\";s:4:\\\"text\\\";s:6:\\\"answer\\\";s:597:\\\"Advertising strategies for nsoom633 travel app:\\n\\nPerformance-based pricing - Pay per booking\\/click, not just impressions\\nGeo-targeted campaigns - Show ads for destinations users are actively planning\\nSelf-service ad platform - Easy dashboard for businesses to create\\/manage ads\\nInfluencer partnerships - Collaborate with travel bloggers for sponsored content\\nLocal business packages - Discounted rates for hotels, restaurants in specific cities\\nFreemium trial period - First month free for new advertiser sign-ups\\n\\nFocus on ROI tracking and local market penetration to attract quality advertisers.\\\";s:9:\\\"timestamp\\\";s:24:\\\"2025-05-15T07:43:26.415Z\\\";}i:2;a:4:{s:8:\\\"question\\\";s:74:\\\"What are the projected customer acquisition costs for nsoom633 travel app?\\\";s:13:\\\"question_type\\\";s:6:\\\"number\\\";s:6:\\\"answer\\\";s:2:\\\"28\\\";s:9:\\\"timestamp\\\";s:24:\\\"2025-05-15T07:44:14.047Z\\\";}i:3;a:4:{s:8:\\\"question\\\";s:127:\\\"What are the projected growth targets for nsoom633 travel app in terms of user acquisition and revenue over the next 1-3 years?\\\";s:13:\\\"question_type\\\";s:4:\\\"text\\\";s:6:\\\"answer\\\";s:266:\\\"User Growth:\\n\\nYear 1: 25,000 users\\nYear 2: 100,000 users\\nYear 3: 350,000 users\\n\\nRevenue Growth:\\n\\nYear 1: $500K\\nYear 2: $2.5M\\nYear 3: $8M\\n\\nKey Metrics:\\n\\nMonthly user growth: 15-25%\\nRevenue per user: $20-25 annually\\nMarket expansion: 3 countries by Year 2, 8 by Year 3\\\";s:9:\\\"timestamp\\\";s:24:\\\"2025-05-15T07:44:31.289Z\\\";}}s:15:\\\"\\u0000*\\u0000businessIdea\\\";s:8:\\\"nsoom633\\\";s:14:\\\"\\u0000*\\u0000projectName\\\";s:8:\\\"nsoom633\\\";s:21:\\\"\\u0000*\\u0000projectDescription\\\";s:374:\\\"is an all-in-one travel app that helps users plan personalized trips, discover nearby people, places, and events, connect with fellow travelers and locals through chat and groups, find local hosts, access exclusive deals, stay informed with safety alerts, and enjoy premium travel tools — all designed to create smarter, more social, and more authentic travel experiences.\\\";s:5:\\\"queue\\\";s:14:\\\"business-plans\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2025-05-15 07:44:52.810141\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\"}}', 0, NULL, 1747295092, 1747295090),
(2, 'business-plans', '{\"uuid\":\"06a08170-4f1e-420b-8501-6a8edc2c4bdd\",\"displayName\":\"App\\\\Jobs\\\\GenerateBusinessPlan\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":300,\"retryUntil\":null,\"data\":{\"commandName\":\"App\\\\Jobs\\\\GenerateBusinessPlan\",\"command\":\"O:29:\\\"App\\\\Jobs\\\\GenerateBusinessPlan\\\":7:{s:7:\\\"\\u0000*\\u0000plan\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\Plan\\\";s:2:\\\"id\\\";i:22;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:10:\\\"\\u0000*\\u0000answers\\\";a:4:{i:0;a:4:{s:8:\\\"question\\\";s:38:\\\"What is the main goal of this project?\\\";s:13:\\\"question_type\\\";s:4:\\\"text\\\";s:6:\\\"answer\\\";s:140:\\\"Building a comprehensive travel app that simplifies trip planning and creates meaningful connections between travelers and locals worldwide.\\\";s:9:\\\"timestamp\\\";s:24:\\\"2025-05-15T07:49:19.461Z\\\";}i:1;a:4:{s:8:\\\"question\\\";s:123:\\\"What is the target market segment for the travel app, and what specific demographics or psychographics define this segment?\\\";s:13:\\\"question_type\\\";s:4:\\\"text\\\";s:6:\\\"answer\\\";s:741:\\\"Target Market Segment: Social-First Travelers (25-40 years)\\nDemographics:\\n\\nAge: 25-40 (millennials and Gen Z professionals)\\nIncome: $40k-$100k annually\\nLocation: Urban areas, tech-savvy regions\\nTravel frequency: 3-5 trips per year\\nEducation: College-educated, digitally native\\n\\nPsychographics:\\n\\nValue authentic local experiences over tourist attractions\\nActive on social media, share travel content\\nSeek community and connections while traveling\\nPrefer mobile-first solutions for booking and planning\\nEnvironmentally conscious, support local businesses\\nBudget-conscious but willing to pay for unique experiences\\n\\nPrimary focus on solo travelers, young couples, and friend groups who want cultural immersion and meaningful travel connections.\\\";s:9:\\\"timestamp\\\";s:24:\\\"2025-05-15T07:49:39.681Z\\\";}i:2;a:4:{s:8:\\\"question\\\";s:136:\\\"What unique features or functionalities will the travel app offer to differentiate itself in the market and attract the target audience?\\\";s:13:\\\"question_type\\\";s:4:\\\"text\\\";s:6:\\\"answer\\\";s:932:\\\"Unique Features of nsoom633 Travel App:\\n1. Local Connection Hub\\n\\nReal-time nearby traveler finder with chat\\nVerified local host matching system\\nGroup formation for shared experiences\\n\\n2. AI-Powered Personalization\\n\\nSmart itinerary generation based on interests\\nCultural preference matching\\nDynamic recommendations using travel behavior\\n\\n3. Social Travel Tools\\n\\nTravel buddy finder with compatibility scoring\\nCollaborative trip planning for groups\\nLive travel stories and community feed\\n\\n4. Safety & Trust Features\\n\\nReal-time safety alerts with location tracking\\nVerified user profiles with travel history\\nEmergency assistance network\\n\\n5. Exclusive Local Experiences\\n\\nHidden gem discoveries from locals\\nCommunity-curated experience marketplace\\nLocal business partnerships for authentic dining\\/activities\\n\\nThese features create a social travel ecosystem that goes beyond booking to build genuine connections and authentic experiences.\\\";s:9:\\\"timestamp\\\";s:24:\\\"2025-05-15T07:49:59.607Z\\\";}i:3;a:4:{s:8:\\\"question\\\";s:100:\\\"What is the projected timeline and budget for the development and launch of the nsoom633 travel app?\\\";s:13:\\\"question_type\\\";s:4:\\\"text\\\";s:6:\\\"answer\\\";s:734:\\\"Development Timeline & Budget for nsoom633:\\nTimeline (18 months):\\n\\nPhase 1: MVP Development (6 months)\\nPhase 2: Beta Testing & Refinement (4 months)\\nPhase 3: Full Launch & Marketing (3 months)\\nPhase 4: Post-Launch Optimization (5 months)\\n\\nBudget Breakdown:\\n\\nDevelopment Team: $400,000\\nUI\\/UX Design: $80,000\\nBackend Infrastructure: $100,000\\nTesting & QA: $60,000\\nMarketing & Launch: $150,000\\nLegal & Compliance: $40,000\\nOperational Costs: $70,000\\n\\nTotal Budget: $900,000\\nKey Milestones:\\n\\nMonth 6: MVP with core features\\nMonth 10: Beta launch with 1,000 users\\nMonth 13: Public launch in UAE\\/Saudi\\nMonth 18: Full feature set with 10,000+ users\\n\\nThis allows for iterative development with user feedback integration throughout the process.\\\";s:9:\\\"timestamp\\\";s:24:\\\"2025-05-15T07:50:20.503Z\\\";}}s:15:\\\"\\u0000*\\u0000businessIdea\\\";s:8:\\\"nsoom633\\\";s:14:\\\"\\u0000*\\u0000projectName\\\";s:8:\\\"nsoom633\\\";s:21:\\\"\\u0000*\\u0000projectDescription\\\";s:374:\\\"is an all-in-one travel app that helps users plan personalized trips, discover nearby people, places, and events, connect with fellow travelers and locals through chat and groups, find local hosts, access exclusive deals, stay informed with safety alerts, and enjoy premium travel tools — all designed to create smarter, more social, and more authentic travel experiences.\\\";s:5:\\\"queue\\\";s:14:\\\"business-plans\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2025-05-15 07:50:45.402467\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\"}}', 0, NULL, 1747295445, 1747295443),
(3, 'business-plans', '{\"uuid\":\"c8b372bf-a80c-4495-bfe5-b9589d8756fe\",\"displayName\":\"App\\\\Jobs\\\\GenerateBusinessPlan\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":300,\"retryUntil\":null,\"data\":{\"commandName\":\"App\\\\Jobs\\\\GenerateBusinessPlan\",\"command\":\"O:29:\\\"App\\\\Jobs\\\\GenerateBusinessPlan\\\":7:{s:7:\\\"\\u0000*\\u0000plan\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\Plan\\\";s:2:\\\"id\\\";i:23;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:10:\\\"\\u0000*\\u0000answers\\\";a:4:{i:0;a:4:{s:8:\\\"question\\\";s:58:\\\"What is the projected target market segment for breezes95?\\\";s:13:\\\"question_type\\\";s:4:\\\"text\\\";s:6:\\\"answer\\\";s:14:\\\"all travellers\\\";s:9:\\\"timestamp\\\";s:24:\\\"2025-05-16T05:30:32.529Z\\\";}i:1;a:4:{s:8:\\\"question\\\";s:138:\\\"What specific characteristics or preferences do travellers in the target market segment have that make them ideal customers for breezes95?\\\";s:13:\\\"question_type\\\";s:4:\\\"text\\\";s:6:\\\"answer\\\";s:286:\\\"Travelers in the target market segment prefer personalized, affordable, and culturally rich experiences. They value convenience, local insights, and unique destinations—making them ideal customers for Breezes95, which specializes in tailored travel plans that match these preferences.\\\";s:9:\\\"timestamp\\\";s:24:\\\"2025-05-16T05:31:42.114Z\\\";}i:2;a:4:{s:8:\\\"question\\\";s:97:\\\"What pricing strategy will breezes95 adopt to ensure affordability for the target market segment?\\\";s:13:\\\"question_type\\\";s:4:\\\"text\\\";s:6:\\\"answer\\\";s:264:\\\"Breezes95 will adopt a value-based pricing strategy, offering budget-friendly travel packages without compromising on quality. By partnering with local providers and optimizing costs, the platform ensures affordable and accessible experiences for its target market\\\";s:9:\\\"timestamp\\\";s:24:\\\"2025-05-16T05:32:11.500Z\\\";}i:3;a:4:{s:8:\\\"question\\\";s:44:\\\"Who are your main competitors in the market?\\\";s:13:\\\"question_type\\\";s:4:\\\"text\\\";s:6:\\\"answer\\\";s:251:\\\"Our main competitors include online travel platforms like Expedia, Airbnb Experiences, and local travel agencies. However, Breezes95 stands out by focusing on personalized, affordable, and culturally immersive travel plans tailored to our niche market\\\";s:9:\\\"timestamp\\\";s:24:\\\"2025-05-16T05:32:40.338Z\\\";}}s:15:\\\"\\u0000*\\u0000businessIdea\\\";s:9:\\\"breezes95\\\";s:14:\\\"\\u0000*\\u0000projectName\\\";s:9:\\\"breezes95\\\";s:21:\\\"\\u0000*\\u0000projectDescription\\\";s:2021:\\\"Project Name: breezes95\\n\\nIn the realm of technology and software, \'breezes95\' emerges as an innovative Hybrid business project, aiming to revolutionize travel experiences through its cutting-edge All-in-One Travel App. This multifaceted application is designed to streamline every aspect of travel, providing users with a seamless and comprehensive solution for all their travel needs.\\n\\nWith breezes95, travelers can access a wide array of features and services conveniently integrated into a single platform. From flight bookings and accommodation reservations to itinerary planning and local recommendations, this app offers a one-stop solution for all travel-related requirements. By leveraging advanced technology and intuitive design, breezes95 simplifies the entire travel process, saving users time and enhancing their overall travel experience.\\n\\nThe primary objective of breezes95 is to enhance customer satisfaction and convenience by offering a user-friendly interface that caters to the diverse needs of modern travelers. By centralizing travel planning and bookings, the app eliminates the hassle of navigating multiple platforms, ensuring a hassle-free and efficient travel experience for users.\\n\\nStakeholders in the travel industry stand to benefit significantly from breezes95\'s innovative approach. Travel agencies can expand their reach and improve customer engagement, while hotels and airlines can capitalize on increased bookings and brand exposure. Additionally, travelers themselves experience heightened convenience, personalized recommendations, and cost-effective travel solutions through the app.\\n\\nIn an industry driven by technological advancements, breezes95 sets itself apart by combining functionality with user-centric design, making it a game-changer in the competitive landscape of travel technology. Embracing breezes95 means embracing a future where travel planning is simplified, personalized, and tailored to individual preferences, ultimately redefining the way we explore the world.\\\";s:5:\\\"queue\\\";s:14:\\\"business-plans\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2025-05-16 05:33:00.959202\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\"}}', 0, NULL, 1747373580, 1747373581),
(4, 'business-plans', '{\"uuid\":\"39ea82c8-3f1d-4a8d-9615-0e6bcff1b13f\",\"displayName\":\"App\\\\Jobs\\\\GenerateBusinessPlan\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":300,\"retryUntil\":null,\"data\":{\"commandName\":\"App\\\\Jobs\\\\GenerateBusinessPlan\",\"command\":\"O:29:\\\"App\\\\Jobs\\\\GenerateBusinessPlan\\\":7:{s:7:\\\"\\u0000*\\u0000plan\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\Plan\\\";s:2:\\\"id\\\";i:24;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:10:\\\"\\u0000*\\u0000answers\\\";a:4:{i:0;a:4:{s:8:\\\"question\\\";s:38:\\\"What is the main goal of this project?\\\";s:13:\\\"question_type\\\";s:4:\\\"text\\\";s:6:\\\"answer\\\";s:365:\\\"The main goal of this project is to create a comprehensive and user-friendly travel app that enhances the overall\\ntravel experience by providing personalized planning, discovery features, community engagement, local support,\\nexclusive benefits, safety information, and premium tools. This goal aims to make travel smarter, more social, and\\nmore authentic for users.\\\";s:9:\\\"timestamp\\\";s:24:\\\"2025-05-17T06:12:13.535Z\\\";}i:1;a:4:{s:8:\\\"question\\\";s:30:\\\"Who are your target customers?\\\";s:13:\\\"question_type\\\";s:4:\\\"text\\\";s:6:\\\"answer\\\";s:406:\\\"The target customers for this all-in-one travel app include individuals who are planning trips or looking to\\nexplore new destinations. The app caters to a wide range of travelers, whether they are solo adventurers,\\nfamilies, groups, or couples. It also benefits local residents and businesses by providing them with opportunities\\nto connect with tourists, promote their services, and offer exclusive deals.\\\";s:9:\\\"timestamp\\\";s:24:\\\"2025-05-17T06:12:28.681Z\\\";}i:2;a:4:{s:8:\\\"question\\\";s:61:\\\"How much revenue do you expect to generate in the first year?\\\";s:13:\\\"question_type\\\";s:6:\\\"number\\\";s:6:\\\"answer\\\";s:5:\\\"10000\\\";s:9:\\\"timestamp\\\";s:24:\\\"2025-05-17T06:12:39.680Z\\\";}i:3;a:4:{s:8:\\\"question\\\";s:44:\\\"Who are your main competitors in the market?\\\";s:13:\\\"question_type\\\";s:4:\\\"text\\\";s:6:\\\"answer\\\";s:12:\\\"couchsurfing\\\";s:9:\\\"timestamp\\\";s:24:\\\"2025-05-17T06:12:58.283Z\\\";}}s:15:\\\"\\u0000*\\u0000businessIdea\\\";s:9:\\\"breezes95\\\";s:14:\\\"\\u0000*\\u0000projectName\\\";s:9:\\\"breezes95\\\";s:21:\\\"\\u0000*\\u0000projectDescription\\\";s:2021:\\\"Project Name: breezes95\\n\\nIn the realm of technology and software, \'breezes95\' emerges as an innovative Hybrid business project, aiming to revolutionize travel experiences through its cutting-edge All-in-One Travel App. This multifaceted application is designed to streamline every aspect of travel, providing users with a seamless and comprehensive solution for all their travel needs.\\n\\nWith breezes95, travelers can access a wide array of features and services conveniently integrated into a single platform. From flight bookings and accommodation reservations to itinerary planning and local recommendations, this app offers a one-stop solution for all travel-related requirements. By leveraging advanced technology and intuitive design, breezes95 simplifies the entire travel process, saving users time and enhancing their overall travel experience.\\n\\nThe primary objective of breezes95 is to enhance customer satisfaction and convenience by offering a user-friendly interface that caters to the diverse needs of modern travelers. By centralizing travel planning and bookings, the app eliminates the hassle of navigating multiple platforms, ensuring a hassle-free and efficient travel experience for users.\\n\\nStakeholders in the travel industry stand to benefit significantly from breezes95\'s innovative approach. Travel agencies can expand their reach and improve customer engagement, while hotels and airlines can capitalize on increased bookings and brand exposure. Additionally, travelers themselves experience heightened convenience, personalized recommendations, and cost-effective travel solutions through the app.\\n\\nIn an industry driven by technological advancements, breezes95 sets itself apart by combining functionality with user-centric design, making it a game-changer in the competitive landscape of travel technology. Embracing breezes95 means embracing a future where travel planning is simplified, personalized, and tailored to individual preferences, ultimately redefining the way we explore the world.\\\";s:5:\\\"queue\\\";s:14:\\\"business-plans\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2025-05-17 06:13:25.328128\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\"}}', 0, NULL, 1747462405, 1747462406),
(5, 'business-plans', '{\"uuid\":\"84c6e67a-51ac-46ef-a6e8-6e24b98ce355\",\"displayName\":\"App\\\\Jobs\\\\GenerateBusinessPlan\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":3,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":300,\"retryUntil\":null,\"data\":{\"commandName\":\"App\\\\Jobs\\\\GenerateBusinessPlan\",\"command\":\"O:29:\\\"App\\\\Jobs\\\\GenerateBusinessPlan\\\":7:{s:7:\\\"\\u0000*\\u0000plan\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\Plan\\\";s:2:\\\"id\\\";i:25;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}s:10:\\\"\\u0000*\\u0000answers\\\";a:4:{i:0;a:4:{s:8:\\\"question\\\";s:38:\\\"What is the main goal of this project?\\\";s:13:\\\"question_type\\\";s:4:\\\"text\\\";s:6:\\\"answer\\\";s:21:\\\"xxxxxxxxxxxxxxxxxxxxx\\\";s:9:\\\"timestamp\\\";s:24:\\\"2025-05-17T06:36:18.849Z\\\";}i:1;a:4:{s:8:\\\"question\\\";s:30:\\\"Who are your target customers?\\\";s:13:\\\"question_type\\\";s:4:\\\"text\\\";s:6:\\\"answer\\\";s:15:\\\"xxxxxxxxxxxxxxx\\\";s:9:\\\"timestamp\\\";s:24:\\\"2025-05-17T06:36:22.302Z\\\";}i:2;a:4:{s:8:\\\"question\\\";s:61:\\\"How much revenue do you expect to generate in the first year?\\\";s:13:\\\"question_type\\\";s:6:\\\"number\\\";s:6:\\\"answer\\\";s:2:\\\"22\\\";s:9:\\\"timestamp\\\";s:24:\\\"2025-05-17T06:36:25.119Z\\\";}i:3;a:4:{s:8:\\\"question\\\";s:44:\\\"Who are your main competitors in the market?\\\";s:13:\\\"question_type\\\";s:4:\\\"text\\\";s:6:\\\"answer\\\";s:17:\\\"xxxxxxxxxxxxxxxxx\\\";s:9:\\\"timestamp\\\";s:24:\\\"2025-05-17T06:36:35.033Z\\\";}}s:15:\\\"\\u0000*\\u0000businessIdea\\\";s:8:\\\"nsoom633\\\";s:14:\\\"\\u0000*\\u0000projectName\\\";s:8:\\\"nsoom633\\\";s:21:\\\"\\u0000*\\u0000projectDescription\\\";s:374:\\\"is an all-in-one travel app that helps users plan personalized trips, discover nearby people, places, and events, connect with fellow travelers and locals through chat and groups, find local hosts, access exclusive deals, stay informed with safety alerts, and enjoy premium travel tools — all designed to create smarter, more social, and more authentic travel experiences.\\\";s:5:\\\"queue\\\";s:14:\\\"business-plans\\\";s:5:\\\"delay\\\";O:25:\\\"Illuminate\\\\Support\\\\Carbon\\\":3:{s:4:\\\"date\\\";s:26:\\\"2025-05-17 06:36:40.914170\\\";s:13:\\\"timezone_type\\\";i:3;s:8:\\\"timezone\\\";s:3:\\\"UTC\\\";}}\"}}', 0, NULL, 1747463800, 1747463798);

-- --------------------------------------------------------

--
-- Table structure for table `markets`
--

CREATE TABLE `markets` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `plan_id` bigint(20) UNSIGNED NOT NULL,
  `industry` varchar(255) DEFAULT NULL,
  `target_market` text DEFAULT NULL,
  `market_size` varchar(255) DEFAULT NULL,
  `trends` text DEFAULT NULL,
  `competitors` text DEFAULT NULL,
  `competitive_advantage` text DEFAULT NULL,
  `risks` text DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2025_05_10_123114_create_sessions_table', 1),
(2, '2025_05_10_123345_create_users_table', 2),
(3, '2025_05_10_123929_create_projects_table', 3),
(4, '2025_05_10_124250_create_plans_table', 4),
(5, '2025_05_10_124832_create_finances_table', 5),
(6, '2025_05_10_124949_create_audiences_table', 6),
(7, '2025_05_10_125108_create_markets_table', 7),
(8, '2025_05_10_125240_create_goals_table', 8),
(9, '2025_05_10_125405_create_tasks_table', 9),
(10, '2025_05_10_125558_create_subscriptions_table', 10),
(11, '2025_05_10_125804_create_payments_table', 11),
(12, '2025_05_10_125854_create_ai_suggestions_table', 12),
(13, '2025_05_11_023014_create_cache_table', 13),
(14, '2025_05_11_023332_add_remember_token_to_users_table', 14),
(15, '2025_05_11_081127_create_ai_chat_tables', 15),
(16, '2025_05_12_014317_create_conversations_table', 16),
(17, '2025_05_12_014348_create_chat_messages_table', 16),
(18, '2025_05_12_113623_create_plan_questions_table', 17),
(19, '2025_05_12_113638_create_plan_answers_table', 17),
(20, '2025_05_12_114027_add_questioning_fields_to_plans_table', 18),
(21, '2025_05_12_133717_update_plan_status_enum', 19),
(22, '2025_05_12_140724_update_plans_table_set_nullable_ai_analysis', 20),
(23, '2025_05_13_035544_create_business_types_table', 21),
(24, '2025_05_13_035717_create_industries_table', 22),
(25, '2025_05_13_040040_update_projects_table_add_relationships', 23),
(26, '2025_05_13_095953_add_project_details_to_projects_table', 24),
(27, '2025_05_13_100150_reorder_projects_table_columns', 25),
(28, '2025_05_13_103234_update_target_market_column_size', 26),
(29, '2025_05_15_064739_fix_plans_project_foreign_key', 27),
(30, '2025_05_15_073117_create_jobs_table', 28),
(31, '2025_05_17_130925_update_plans_table_structure', 29),
(34, '2025_05_18_041706_update_ai_suggestions_table_with_enhancements', 30),
(35, '2025_05_18_053434_add_ai_analysis_to_plans_table', 31),
(36, '2025_05_27_141150_create_contracts_table', 32),
(37, '2025_05_28_062349_update_contracts_table_fix_columns', 33);

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `subscription_id` bigint(20) UNSIGNED NOT NULL,
  `payment_date` date NOT NULL,
  `payment_method` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `transaction_id` varchar(255) NOT NULL,
  `status` enum('pending','completed','failed') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `subscription_id`, `payment_date`, `payment_method`, `amount`, `transaction_id`, `status`, `created_at`, `updated_at`) VALUES
(1, 3, '2025-05-31', 'credit_card', 0.00, 'TXN-1748665756-IUNJBOWR', 'completed', '2025-05-30 20:29:16', '2025-05-30 20:29:16'),
(2, 4, '2025-05-31', 'credit_card', 0.00, 'TXN-1748665763-ZHKAWHEE', 'completed', '2025-05-30 20:29:23', '2025-05-30 20:29:23'),
(3, 5, '2025-05-31', 'credit_card', 0.00, 'TXN-1748665849-ACGKWSQ8', 'completed', '2025-05-30 20:30:49', '2025-05-30 20:30:49'),
(4, 6, '2025-05-31', 'credit_card', 0.00, 'TXN-1748665855-SZ1KIZXD', 'completed', '2025-05-30 20:30:55', '2025-05-30 20:30:55'),
(5, 7, '2025-05-31', 'credit_card', 0.00, 'TXN-1748666024-MBHTFUEM', 'completed', '2025-05-30 20:33:44', '2025-05-30 20:33:44');

-- --------------------------------------------------------

--
-- Table structure for table `plans`
--

CREATE TABLE `plans` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `project_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `summary` text DEFAULT NULL,
  `ai_analysis` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`ai_analysis`)),
  `ai_analysis_path` varchar(255) DEFAULT NULL,
  `pdf_path` varchar(255) DEFAULT NULL,
  `status` enum('draft','generating','partially_completed','completed','premium','failed') NOT NULL,
  `progress_percentage` int(11) NOT NULL DEFAULT 0,
  `conversation_file_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `plans`
--

INSERT INTO `plans` (`id`, `project_id`, `title`, `summary`, `ai_analysis`, `ai_analysis_path`, `pdf_path`, `status`, `progress_percentage`, `conversation_file_path`, `created_at`, `updated_at`) VALUES
(52, 11, 'Breezes95 Travel Companion', 'AI-generated business plan based on interview questions', '\"{\\\"executive_summary\\\":\\\"<h2>Executive Summary<\\\\\\/h2><p>BREEZES95 aims to revolutionize travel planning by offering a comprehensive web and mobile app that caters to travelers of all types, providing a one-stop solution for trip planning, local recommendations, social connections, and event discoveries.<\\\\\\/p>\\\",\\\"market_analysis\\\":\\\"<h2>Market Analysis<\\\\\\/h2><p>The target market segment for BREEZES95 includes travel enthusiasts, explorers, digital nomads, and tourists seeking personalized travel experiences. The app will cater to a diverse audience of all ages and travel preferences.<\\\\\\/p>\\\",\\\"swot_analysis\\\":\\\"<h2>SWOT Analysis<\\\\\\/h2><p><strong>Strengths:<\\\\\\/strong> All-in-one travel planning platform, user-friendly interface. <strong>Weaknesses:<\\\\\\/strong> Initial brand awareness, competition from established travel apps. <strong>Opportunities:<\\\\\\/strong> Global expansion, partnerships with tourism boards. <strong>Threats:<\\\\\\/strong> Market saturation, changing travel trends.<\\\\\\/p>\\\",\\\"marketing_strategy\\\":\\\"<h2>Marketing Strategy<\\\\\\/h2><p>BREEZES95 will focus on digital marketing channels including social media advertising, influencer partnerships, and content marketing to build brand awareness. Targeted promotions, referral programs, and partnerships with travel influencers will be key strategies to attract users.<\\\\\\/p>\\\",\\\"financial_plan\\\":\\\"<h2>Financial Plan<\\\\\\/h2><p>The revenue model for BREEZES95 will include subscription fees for premium features and ad revenue from strategic partnerships with travel-related businesses. The estimated pricing strategy for the subscription model ranges from $10 to $250 per user, offering different tiers of service.<\\\\\\/p>\\\",\\\"operational_plan\\\":\\\"<h2>Operational Plan<\\\\\\/h2><p>BREEZES95 will focus on user experience, continuous app improvement, and customer support to ensure user satisfaction and retention. Regular updates, community engagement, and data-driven decision-making will be essential for the app\'s success.<\\\\\\/p>\\\"}\"', NULL, NULL, 'premium', 100, NULL, '2025-05-27 00:33:17', '2025-05-30 20:29:16'),
(53, 11, 'Breezes95 Business Blueprint', 'AI-generated business plan based on interview questions', '\"{\\\"executive_summary\\\":\\\"<h2>Executive Summary<\\\\\\/h2><p>BREEZES95 is a revolutionary web and mobile app that redefines the travel experience for health-conscious individuals aged 25-45. With a focus on personalized trip planning, community engagement, and seamless booking functionalities, BREEZES95 aims to become the go-to travel companion for users seeking convenience, connection, and unforgettable adventures.<\\\\\\/p>\\\",\\\"market_analysis\\\":\\\"<h2>Market Analysis<\\\\\\/h2><p>BREEZES95 targets health-conscious individuals aged 25-45 within the travel and lifestyle app industry. By offering tailored travel recommendations, fostering a community-driven platform, and integrating advanced AI algorithms, BREEZES95 sets itself apart in a competitive market. Through thorough market research and analysis of consumer trends, BREEZES95 aims to capture a significant market share and capitalize on the growing demand for personalized travel experiences.<\\\\\\/p>\\\",\\\"swot_analysis\\\":\\\"<h2>SWOT Analysis<\\\\\\/h2><ul><li><strong>Strengths:<\\\\\\/strong> Personalized recommendations, community engagement, advanced AI algorithms.<\\\\\\/li><li><strong>Weaknesses:<\\\\\\/strong> Initial brand awareness, competition from established travel apps.<\\\\\\/li><li><strong>Opportunities:<\\\\\\/strong> Growing market of health-conscious travelers, expansion into corporate partnerships.<\\\\\\/li><li><strong>Threats:<\\\\\\/strong> Rapid technological changes, potential economic downturn affecting travel industry.<\\\\\\/li><\\\\\\/ul>\\\",\\\"marketing_strategy\\\":\\\"<h2>Marketing Strategy<\\\\\\/h2><p>BREEZES95\'s marketing strategy focuses on digital marketing campaigns targeting health-conscious individuals on social media platforms, travel forums, and lifestyle blogs. Collaborations with influencers, travel bloggers, and wellness advocates will amplify brand awareness. Additionally, strategic partnerships with gyms, wellness centers, and travel agencies will enhance market reach. A customer referral program and loyalty rewards system will incentivize user engagement and retention.<\\\\\\/p>\\\",\\\"financial_plan\\\":\\\"<h2>Financial Plan<\\\\\\/h2><p>BREEZES95\'s revenue streams include direct sales of travel-related services, subscription models for premium features, corporate partnerships, catering services, and loyalty program revenues. By diversifying income sources and maintaining competitive pricing, BREEZES95 aims for sustainable growth and profitability. Detailed financial projections, cost analysis, and revenue forecasts will guide financial decision-making and ensure long-term viability.<\\\\\\/p>\\\",\\\"operational_plan\\\":\\\"<h2>Operational Plan<\\\\\\/h2><p>BREEZES95 will focus on developing a user-friendly interface, enhancing AI algorithms for personalized recommendations, and streamlining the booking process. A dedicated customer support team will provide assistance to users, ensuring a seamless travel experience. Continuous software updates, bug fixes, and feature enhancements will be prioritized to meet evolving user needs and industry standards. Scalable infrastructure and data security measures will be implemented to support future growth and user data protection.<\\\\\\/p>\\\"}\"', NULL, 'plans/53/analysis.pdf', 'premium', 100, NULL, '2025-05-28 21:48:04', '2025-05-30 20:29:16'),
(54, 11, 'Breezes95 Travel App', NULL, '\"{\\\"executive_summary\\\":\\\"<h2>Executive Summary<\\\\\\/h2><p>BREEZES95 is a revolutionary travel planning web and mobile app designed to cater to health-conscious individuals aged 25-45 who seek convenience and quality in their travel experiences. The app aims to provide personalized trip recommendations, community engagement, and seamless event discovery. With a focus on user-centric design and ethical sourcing, BREEZES95 is poised to disrupt the travel tech industry.<\\\\\\/p>\\\",\\\"market_analysis\\\":\\\"<h2>Market Analysis<\\\\\\/h2><p>The target market for BREEZES95 comprises health-conscious individuals aged 25-45, including urban professionals, working parents, and self-care enthusiasts. These consumers value convenience, quality, and sustainability in their travel planning. BREEZES95 aims to capture this market segment by offering personalized trip recommendations, community interaction, and ethical travel solutions.<\\\\\\/p>\\\",\\\"swot_analysis\\\":\\\"<h2>SWOT Analysis<\\\\\\/h2><p><strong>Strengths:<\\\\\\/strong> Personalized user experiences, strong community engagement, ethical sourcing of travel options. <br><strong>Weaknesses:<\\\\\\/strong> Initial user acquisition challenges, competition from established travel apps. <br><strong>Opportunities:<\\\\\\/strong> Growing demand for personalized travel experiences, expanding user base through strategic partnerships. <br><strong>Threats:<\\\\\\/strong> Rapid technological advancements, changing consumer preferences in the travel industry.<\\\\\\/p>\\\",\\\"marketing_strategy\\\":\\\"<h2>Marketing Strategy<\\\\\\/h2><p>BREEZES95 plans to differentiate itself by offering personalized trip recommendations, fostering community engagement, and providing ethically sourced travel options. The marketing strategy includes targeted digital campaigns, influencer partnerships, social media engagement, and user-generated content promotion. Collaborations with eco-conscious brands and travel influencers will enhance brand visibility and attract the target market.<\\\\\\/p>\\\",\\\"financial_plan\\\":\\\"<h2>Financial Plan<\\\\\\/h2><p>The projected user growth rate for BREEZES95 over the next 3 years is 10,000 users. The monetization strategy includes subscription plans, in-app purchases, advertisements, affiliate marketing, sponsorships, data monetization, white labeling, and freemium models. By diversifying revenue streams, BREEZES95 aims to maximize earning potential while delivering value to users.<\\\\\\/p>\\\",\\\"operational_plan\\\":\\\"<h2>Operational Plan<\\\\\\/h2><p>The operational plan for BREEZES95 includes developing advanced algorithms for personalized recommendations, implementing community engagement features within the app, and establishing partnerships with eco-friendly travel providers. The team will focus on continuous app improvements, user feedback integration, and data privacy compliance to ensure a seamless user experience and sustainable growth.<\\\\\\/p>\\\"}\"', NULL, 'plans/54/analysis.pdf', 'premium', 100, NULL, '2025-05-30 00:44:46', '2025-05-30 20:29:16');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('new_project','existed_project') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'new_project',
  `industry_id` int(10) UNSIGNED DEFAULT NULL,
  `business_type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `main_product_service` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `project_scale` enum('small','medium','large') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `team_size` int(11) DEFAULT NULL,
  `revenue_model` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `main_differentiator` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `target_market` text NOT NULL,
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `user_id`, `name`, `description`, `status`, `industry_id`, `business_type_id`, `main_product_service`, `project_scale`, `team_size`, `revenue_model`, `main_differentiator`, `target_market`, `location`, `created_at`, `updated_at`) VALUES
(11, 1, 'breezes95', 'BREEZES95: It\'s like having a travel buddy in your pocket! Breezes95 is a web and mobile app that helps you plan trips, find places nearby, connect with other travelers, and discover events. Whether you\'re a jet-setter or just looking for cool local spots, Breezes95 has got your back. It\'s perfect for anyone who loves exploring new destinations, meeting fellow travelers, and making the most of their adventures. With Breezes95, your next journey is just a tap away!', 'new_project', 1, 3, '1. Trip planning\n2. Nearby places\n3. Connect with travelers\n4. Discover events\n5. Explore destinations\n6. Meet travelers\n7. Adventure planning\n8. Social networking\n9. Event discovery\n10. Travel exploration', 'medium', 5, '1. Subscription Model\n2. In-App Purchases Model\n3. Freemium Model\n4. Ad-Based Model: The app displays advertisements to users,', '1. User-Friendly Interface\n2. Enhanced Security Features\n3. Customizable Solutions\n4. Seamless Integration Capabilities', '1. Solo female travelers\n2. Adventure seekers looking\n3. Digital nomads searching\n4. Foodies craving culinary\n5. Backpackers in need\n6. Family travelers seeking\n7. Nature\n8. Frequent travelers\n9. Solo adventurers\n10. Local event-goers', 'Global digital presence.', '2025-05-21 07:26:02', '2025-05-21 07:26:02'),
(12, 1, 'Hala restaurant', 'Hala Restaurant is a cool place to eat in Riyadh. It\'s a modern spot where you can grab a delicious bite to eat. Whether you\'re looking for a quick snack or a full meal, this restaurant has got you covered. It\'s perfect for anyone who enjoys good food in a trendy setting. So, if you\'re in Riyadh and feeling hungry, Hala Restaurant is the place to go!', 'existed_project', 2, 1, '1. Lunch specials\n2. Dinner packages\n3. Quick snack menu\n4. Full meal options\n5. Trendy setting\n6. Delicious bites\n7. Catering services\n8. Takeout orders\n9. Delivery options\n10. Reservation system', 'medium', 20, '1. Delivery Orders\n2. Dine-In Sales\n3. Catering Services\n4. Takeout Meals\n5. Beverage Sales', '1. Middle Eastern Fusion Cuisine\n2. Riyadh\'s Trendiest Dining Spot\n3. Instagrammable Modern Decor\n4. Local Ingredients Showcase\n5. Lively Cultural Events', '1. Foodies seeking trendy dining experiences in Riyadh\n2. Locals looking for a convenient spot in solutions\n3. Tourists in Riyadh searching for a contemporary\n4. Professionals seeking a stylish lunch spot in solutions\n5. Students in Riyadh looking for a hip\n6. Health-conscious individuals in Riyadh desiring fresh and\n7. Event planners or organizers in Riyadh seeking solutions\n8. Frequent travelers seeking experiences\n9. Solo adventurers exploring cities\n10. Local event-goers finding activities', 'Physical location: Riyadh downtown area.', '2025-05-21 20:57:08', '2025-05-21 20:57:08'),
(13, 1, 'breezes950000', 'It\'s like a mystery box waiting to be opened! We\'re still figuring out all the cool stuff this project will do. If you love surprises and new adventures, this is for you! Think of it as a fun journey we\'re all taking together. for exciting updates and discoveries. Let\'s unravel this mystery and enjoy the ride!', 'new_project', 34, 4, '1. DIY Craft Kits\n2. Exclusive Art Supplies\n3. Crafting Workshops\n4. Mystery Art Boxes\n5. Artisanal Tool Sets\n6. Custom Paint Kits\n7. Craft Subscription Boxes\n8. Creative Project Guides\n9. Art Masterclasses\n10. Crafting Materials Bundle', 'medium', 3, '1. Mystery Box Sales\n2. Crafting Workshops\n3. Subscription Boxes\n4. Craft Supply Store\n5. Online Classes', '1. Surprise Craft Kits\n2. Exclusive Limited Editions\n3. Collaborative Crafting Community\n4. Monthly Theme Boxes\n5. Interactive Unboxing Experience', '1. Adventure seekers craving surprises and new experiences,\n2. Curious individuals intrigued by the unknown and\n3. Innovators and early adopters drawn to cutting-edge\n4. Collaborative enthusiasts who enjoy engaging with a\n5. Gamification fans looking for an interactive and\n6. Trendsetters and trend watchers seeking to stay\n7. Creatives and artists inspired by the element\n8. Tech-savvy individuals interested in exploring the capabilities', 'Global digital presence.', '2025-05-28 17:59:37', '2025-05-28 17:59:37');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('bEfKyhHB3LBrswpxauaqhz5r2p78qBFLSPUznH81', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiQWd4a2ZzVkpaaEEwVzJvcFJ5aWdJWkFFYUJiVnJrTzAxcUxnRlR1cyI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjk6Il9wcmV2aW91cyI7YToxOntzOjM6InVybCI7czo0ODoiaHR0cDovLzEyNy4wLjAuMTo4MDAwL3BsYW5zL2NyZWF0ZT9wcm9qZWN0X2lkPTExIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czoxNzoicGFzc3dvcmRfaGFzaF93ZWIiO3M6NjA6IiQyeSQxMiRmOWU5MlVFWEowUUVuejRYTGJpeml1c29ac3M1WUlaNEcyNTc1V2s3VEp1aEgzL0d4M24uNiI7fQ==', 1749321377),
('dGLHM7jkNjt1eObi0L4omhj4RAggvH2kxxH7TTQP', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiYlB3RnVqVENhWXZaNVg3T2h0TDhlV1lFTFdxVmVZYkNMVmxmUjF1TyI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjk6Il9wcmV2aW91cyI7YToxOntzOjM6InVybCI7czoyMToiaHR0cDovLzEyNy4wLjAuMTo4MDAwIjt9fQ==', 1749567266),
('NCwXP58XoIl6i22fmLxbs7YCMarrKcIu6pMTYB86', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiYmdwMm9PdmlwS1lJM2RZWVh0b3dvRTFkd1lDV3hMWEpONm45d0ZybiI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjk6Il9wcmV2aW91cyI7YToxOntzOjM6InVybCI7czoyMToiaHR0cDovLzEyNy4wLjAuMTo4MDAwIjt9czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319fQ==', 1749567264),
('WoYeY3diJQasoGXTPKvGCfmh8HMADMWPcGoEUT9l', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'YTo3OntzOjY6Il90b2tlbiI7czo0MDoiVHlRcVdQa21teUdXeFVkRWN5QkdOQmhBbFFvRFV1WmVJM1YxbXgyMSI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czozOiJ1cmwiO2E6MDp7fXM6OToiX3ByZXZpb3VzIjthOjE6e3M6MzoidXJsIjtzOjQ4OiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvcGxhbnMvY3JlYXRlP3Byb2plY3RfaWQ9MTEiO31zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToxO3M6NjoibG9jYWxlIjtzOjI6ImVuIjtzOjE3OiJwYXNzd29yZF9oYXNoX3dlYiI7czo2MDoiJDJ5JDEyJGY5ZTkyVUVYSjBRRW56NFhMYml6aXVzb1pzczVZSVo0RzI1NzVXazdUSnVoSDMvR3gzbi42Ijt9', 1749285858),
('YppzbTdnmSUjJ1HHVTuB2khrrHItvjN8qiU0ipEB', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiSDRyWHVFSFZPMnRMUjRtUjdWZFdRSjFHNjFjMU9ZSkdaVGUzTDdlbCI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjk6Il9wcmV2aW91cyI7YToxOntzOjM6InVybCI7czo0ODoiaHR0cDovLzEyNy4wLjAuMTo4MDAwL3BsYW5zL2NyZWF0ZT9wcm9qZWN0X2lkPTExIjt9czoxNzoicGFzc3dvcmRfaGFzaF93ZWIiO3M6NjA6IiQyeSQxMiRmOWU5MlVFWEowUUVuejRYTGJpeml1c29ac3M1WUlaNEcyNTc1V2s3VEp1aEgzL0d4M24uNiI7fQ==', 1749352096),
('z81SVYUs1SI2rUhHuOqlW2TEo7sE481fXA34sPfe', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'YTo1OntzOjY6Il90b2tlbiI7czo0MDoiWGFmU1hOdThwZDdsT0E0cTdlYlZqNmZtcHZXY0laWVpDRUhPamJHRCI7czo1MDoibG9naW5fd2ViXzU5YmEzNmFkZGMyYjJmOTQwMTU4MGYwMTRjN2Y1OGVhNGUzMDk4OWQiO2k6MTtzOjk6Il9wcmV2aW91cyI7YToxOntzOjM6InVybCI7czozNDoiaHR0cDovLzEyNy4wLjAuMTo4MDAwL3BsYW5zL2NyZWF0ZSI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6MTc6InBhc3N3b3JkX2hhc2hfd2ViIjtzOjYwOiIkMnkkMTIkZjllOTJVRVhKMFFFbno0WExiaXppdXNvWnNzNVlJWjRHMjU3NVdrN1RKdWhIMy9HeDNuLjYiO30=', 1749321269),
('ZURsAJ1q1hpIeX826s1pND4359bykGRZTliiviFF', 1, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiMnVWVTBuMmc0YVZQSEZnTExTMkJnM0dNaG9UbjlidDNJTmJkWXhWTiI7czo2OiJfZmxhc2giO2E6Mjp7czozOiJvbGQiO2E6MDp7fXM6MzoibmV3IjthOjA6e319czo5OiJfcHJldmlvdXMiO2E6MTp7czozOiJ1cmwiO3M6Mjc6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9sb2dpbiI7fXM6NTA6ImxvZ2luX3dlYl81OWJhMzZhZGRjMmIyZjk0MDE1ODBmMDE0YzdmNThlYTRlMzA5ODlkIjtpOjE7fQ==', 1749283135);

-- --------------------------------------------------------

--
-- Table structure for table `subscriptions`
--

CREATE TABLE `subscriptions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `plan_type` enum('free','paid') NOT NULL DEFAULT 'free',
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `status` enum('active','inactive','expired') NOT NULL DEFAULT 'active',
  `payment_method` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subscriptions`
--

INSERT INTO `subscriptions` (`id`, `user_id`, `plan_type`, `start_date`, `end_date`, `status`, `payment_method`, `amount`, `created_at`, `updated_at`) VALUES
(3, 1, 'paid', '2025-05-31', '2025-07-01', 'active', 'credit_card', 0.00, '2025-05-30 20:29:16', '2025-05-30 20:29:16'),
(4, 1, 'paid', '2025-05-31', '2025-07-01', 'active', 'credit_card', 0.00, '2025-05-30 20:29:23', '2025-05-30 20:29:23'),
(5, 1, 'paid', '2025-05-31', '2025-07-01', 'active', 'credit_card', 0.00, '2025-05-30 20:30:49', '2025-05-30 20:30:49'),
(6, 1, 'paid', '2025-05-31', '2025-07-01', 'active', 'credit_card', 0.00, '2025-05-30 20:30:55', '2025-05-30 20:30:55'),
(7, 1, 'paid', '2025-05-31', '2025-07-01', 'active', 'credit_card', 0.00, '2025-05-30 20:33:44', '2025-05-30 20:33:44');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `goal_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `status` enum('pending','in_progress','completed') NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `type` enum('beginner','owner') NOT NULL DEFAULT 'beginner',
  `language` enum('en','ar') NOT NULL DEFAULT 'ar',
  `phone` varchar(255) DEFAULT NULL,
  `profile_photo` varchar(255) DEFAULT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `subscription_type` enum('free','premium') NOT NULL DEFAULT 'free',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `type`, `language`, `phone`, `profile_photo`, `email_verified_at`, `subscription_type`, `created_at`, `updated_at`, `remember_token`) VALUES
(1, 'Nisma95', 'nisma95@breezes95.com', '$2y$12$f9e92UEXJ0QEnz4XLbiziusoZss5YIZ4G2575Wk7TJuhH3/Gx3n.6', 'beginner', 'ar', NULL, NULL, NULL, 'premium', '2025-05-10 05:34:10', '2025-05-30 20:29:16', 'ypS5RB2wls7yKQ34ouymuxQQS7JbyityipcZj5PDqx8TgdyGo4UT6Yyz5ry1');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `ai_suggestions`
--
ALTER TABLE `ai_suggestions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ai_suggestions_plan_id_foreign` (`plan_id`),
  ADD KEY `ai_suggestions_priority_index` (`priority`),
  ADD KEY `ai_suggestions_is_implemented_index` (`is_implemented`),
  ADD KEY `ai_suggestions_category_index` (`category`),
  ADD KEY `ai_suggestions_created_at_index` (`created_at`);

--
-- Indexes for table `audiences`
--
ALTER TABLE `audiences`
  ADD PRIMARY KEY (`id`),
  ADD KEY `audiences_plan_id_foreign` (`plan_id`);

--
-- Indexes for table `business_types`
--
ALTER TABLE `business_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `business_types_business_type_name_unique` (`business_type_name`);

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `chat_messages_conversation_id_index` (`conversation_id`),
  ADD KEY `chat_messages_conversation_id_created_at_index` (`conversation_id`,`created_at`);

--
-- Indexes for table `contracts`
--
ALTER TABLE `contracts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contracts_user_id_foreign` (`user_id`);

--
-- Indexes for table `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `conversations_user_id_index` (`user_id`);

--
-- Indexes for table `finances`
--
ALTER TABLE `finances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `finances_plan_id_foreign` (`plan_id`);

--
-- Indexes for table `goals`
--
ALTER TABLE `goals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `goals_plan_id_foreign` (`plan_id`);

--
-- Indexes for table `industries`
--
ALTER TABLE `industries`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `markets`
--
ALTER TABLE `markets`
  ADD PRIMARY KEY (`id`),
  ADD KEY `markets_plan_id_foreign` (`plan_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `payments_transaction_id_unique` (`transaction_id`),
  ADD KEY `payments_subscription_id_foreign` (`subscription_id`),
  ADD KEY `payments_transaction_id_index` (`transaction_id`);

--
-- Indexes for table `plans`
--
ALTER TABLE `plans`
  ADD PRIMARY KEY (`id`),
  ADD KEY `plans_project_id_foreign` (`project_id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `industry_id` (`industry_id`),
  ADD KEY `business_type_id` (`business_type_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subscriptions_user_id_foreign` (`user_id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tasks_goal_id_foreign` (`goal_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `ai_suggestions`
--
ALTER TABLE `ai_suggestions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

--
-- AUTO_INCREMENT for table `audiences`
--
ALTER TABLE `audiences`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `business_types`
--
ALTER TABLE `business_types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `contracts`
--
ALTER TABLE `contracts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `finances`
--
ALTER TABLE `finances`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `goals`
--
ALTER TABLE `goals`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `industries`
--
ALTER TABLE `industries`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `markets`
--
ALTER TABLE `markets`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `plans`
--
ALTER TABLE `plans`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `subscriptions`
--
ALTER TABLE `subscriptions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `ai_suggestions`
--
ALTER TABLE `ai_suggestions`
  ADD CONSTRAINT `ai_suggestions_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `audiences`
--
ALTER TABLE `audiences`
  ADD CONSTRAINT `audiences_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_conversation_id_foreign` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `contracts`
--
ALTER TABLE `contracts`
  ADD CONSTRAINT `contracts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `conversations`
--
ALTER TABLE `conversations`
  ADD CONSTRAINT `conversations_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `finances`
--
ALTER TABLE `finances`
  ADD CONSTRAINT `finances_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `goals`
--
ALTER TABLE `goals`
  ADD CONSTRAINT `goals_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `markets`
--
ALTER TABLE `markets`
  ADD CONSTRAINT `markets_plan_id_foreign` FOREIGN KEY (`plan_id`) REFERENCES `plans` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_subscription_id_foreign` FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `plans`
--
ALTER TABLE `plans`
  ADD CONSTRAINT `plans_project_id_foreign` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `subscriptions`
--
ALTER TABLE `subscriptions`
  ADD CONSTRAINT `subscriptions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_goal_id_foreign` FOREIGN KEY (`goal_id`) REFERENCES `goals` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
