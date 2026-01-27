<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Méthode non autorisée']);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data) {
    echo json_encode(['success' => false, 'error' => 'Données invalides']);
    exit;
}

$name = isset($data['name']) ? trim($data['name']) : '';
$email = isset($data['email']) ? trim($data['email']) : '';
$subject = isset($data['subject']) ? trim($data['subject']) : '';
$message = isset($data['message']) ? trim($data['message']) : '';

if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    echo json_encode(['success' => false, 'error' => 'Tous les champs sont requis']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'error' => 'Email invalide']);
    exit;
}

// Map subject codes to readable labels
$subjectLabels = [
    'bug' => 'Signaler un bug',
    'question' => 'Question générale',
    'account' => 'Problème de compte',
    'suggestion' => 'Suggestion d\'amélioration',
    'data' => 'Demande relative aux données',
    'other' => 'Autre'
];
$subjectLabel = isset($subjectLabels[$subject]) ? $subjectLabels[$subject] : $subject;

// Save to file
$contactData = [
    'date' => date('Y-m-d H:i:s'),
    'name' => $name,
    'email' => $email,
    'subject' => $subjectLabel,
    'message' => $message
];

$filename = __DIR__ . '/contacts_' . date('Y-m') . '.json';
$contacts = [];

if (file_exists($filename)) {
    $content = file_get_contents($filename);
    $contacts = json_decode($content, true) ?: [];
}

$contacts[] = $contactData;
file_put_contents($filename, json_encode($contacts, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// Send email notification
$to = 'contact@2ovus.com';
$emailSubject = '[2oVus Contact] ' . $subjectLabel . ' - ' . $name;
$emailBody = "Nouveau message de contact reçu:\n\n";
$emailBody .= "Nom: $name\n";
$emailBody .= "Email: $email\n";
$emailBody .= "Sujet: $subjectLabel\n";
$emailBody .= "Date: " . date('d/m/Y H:i') . "\n\n";
$emailBody .= "Message:\n$message\n";

$headers = "From: noreply@2ovus.com\r\n";
$headers .= "Reply-To: $email\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

@mail($to, $emailSubject, $emailBody, $headers);

echo json_encode(['success' => true, 'message' => 'Message enregistré']);
