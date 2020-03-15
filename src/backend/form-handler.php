<?php

try {
    setupEnv();
    processForms($_POST);
} catch (Exception $exception) {
    writeLog($exception->getMessage());
}


/**
 * @throws Exception
 */
function setupEnv()
{
    $envPath = '../../.env';
    if (!is_file($envPath)) {
        throw new Exception('Not found .env file.');
    }
    $handle = fopen($envPath, 'r');
    while (($line = fgets($handle)) !== false) {
        $var = explode('=', $line, 2);
        putenv($var[0].'='.trim(trim($var[1]), '"'));
    }
    fclose($handle);
}

/**
 * @param array $post
 * @throws \PHPMailer\PHPMailer\Exception
 * @throws Exception
 */
function processForms($post)
{
    switch ($post['form']) {
        case 'call-form':
            printMessage('Мы перезвоним Вам очень скоро.', 'call-form');
            sendEmail('Форма *Обратный Звонок*', implode('<br/>', [
                'Пришла форма Обратный Звонок:',
                'Телефон:'.$post['phone'],
            ]));
            break;
        case 'contact-form':
            printMessage('Мы скоро прочитаем Ваше сообщение.', 'contact-form');
            sendEmail('Форма *Написать*', implode('<br/>', [
                'Пришла форма Написать:',
                'Email:'.$post['email'],
                'Имя:'.$post['name'],
                'Сообщение:'.$post['message'],

            ]));
            break;
        default:
            throw new Exception(sprintf('Form data were incorrect %s', var_export($post, true)));
    }
}

function printMessage($message, $messageClass)
{
    echo '<div class="message message-'.$messageClass.'">'.$message.'</div>';
}

/**
 * @param string $subject
 * @param string $message HTML
 * @throws \PHPMailer\PHPMailer\Exception
 */
function sendEmail($subject, $message)
{
    list($host, $username, $password) = explode(':', getenv('SMTP_CREDENTIALS'), 3);

    require_once 'vendor/autoload.php';
    $mailer = new \PHPMailer\PHPMailer\PHPMailer();

    $mailer->isSMTP();

    $mailer->Host = $host;
    $mailer->SMTPAuth = true;
    $mailer->Username = $username;
    $mailer->Password = $password;
    $mailer->SMTPSecure = 'tls';
    $mailer->Port = 587;

    $mailer->setFrom($username);
    $mailer->addAddress($username);
    $mailer->AddCC(getenv('SUPPORT_EMAIL'));
    $mailer->AddCC(getenv('CONTACT_EMAIL'));

    $mailer->isHTML(true);
    $mailer->CharSet = 'UTF-8';
    $mailer->Subject = $subject.' - sweetmebliv.com.ua';
    $mailer->Body = $message;

    $mailer->send();
    $mailer->ClearAllRecipients();
}

function writeLog($data)
{
    $logPath = __DIR__.'/../../var/log/error.log';
    printMessage(sprintf(
        'Что-то пошло не так, свяжитесь с нами или по email %s или по телефону %s',
        getenv('CONTACT_EMAIL'),
        getenv('CONTACT_PHONE_FORMATTED')
    ), 'error');
    file_put_contents($logPath, $data, FILE_APPEND);
}
