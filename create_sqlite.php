<?php
// File: create_sqlite.php - Run this in your project root

// Delete the corrupted file
$dbPath = __DIR__ . '/database/database.sqlite';
if (file_exists($dbPath))
{
    unlink($dbPath);
}

// Create a proper SQLite database using PDO
try
{
    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Enable foreign keys
    $pdo->exec('PRAGMA foreign_keys = ON;');

    // Create a simple test table to ensure it's a valid database
    $pdo->exec('CREATE TABLE IF NOT EXISTS test (id INTEGER)');
    $pdo->exec('DROP TABLE test');

    echo "✅ SQLite database created successfully at: $dbPath\n";
    echo "File size: " . filesize($dbPath) . " bytes\n";
}
catch (PDOException $e)
{
    echo "❌ Error creating SQLite database: " . $e->getMessage() . "\n";
}

$pdo = null; // Close connection