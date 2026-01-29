<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Sanitize form data
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $message = trim($_POST["message"]);

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Please enter a valid email address.";
        exit;
    }

    // Set recipient email - CHANGE THIS TO CLIENT'S EMAIL
    $recipient = "client@example.com";
    
    $subject = "New Contact Form Submission from $name";
    
    $email_content = "Name: $name\n";
    $email_content .= "Email: $email\n\n";
    $email_content .= "Message:\n$message\n";
    
    $email_headers = "From: $name <$email>";
    
    if (mail($recipient, $subject, $email_content, $email_headers)) {
        http_response_code(200);
        header("Location: thank-you.html");
        exit;
    } else {
        http_response_code(500);
        echo "Oops! Something went wrong and we couldn't send your message.";
    }
} else {
    http_response_code(403);
    echo "There was a problem with your submission, please try again.";
}
?>