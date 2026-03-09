<?php
// Importa as classes do PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

// Carrega os arquivos do PHPMailer
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// Verifica se o formulário foi enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // --- COLETA DOS DADOS DO FORMULÁRIO ---
    $empresa = strip_tags(trim($_POST["Empresa"]));
    $representante = strip_tags(trim($_POST["Representante"]));
    $cnpj = strip_tags(trim($_POST["CNPJ"]));
    $ramo = strip_tags(trim($_POST["Ramo"]));
    $interesse = strip_tags(trim($_POST["Interesse"]));
    $como_conheceu = strip_tags(trim($_POST["Como Conheceu"]));
    $telefone = strip_tags(trim($_POST["Telefone"]));
    $email = filter_var(trim($_POST["E-mail"]), FILTER_SANITIZE_EMAIL);
    $rua = strip_tags(trim($_POST["Rua"]));
    $bairro = strip_tags(trim($_POST["Bairro"]));
    $cidade = strip_tags(trim($_POST["Cidade"]));
    $estado = strip_tags(trim($_POST["Estado"]));
    $mensagem = strip_tags(trim($_POST["Mensagem"]));
    $redirectSuccess = trim($_POST["_next"]); // Página de obrigado

    // --- LÓGICA DE UPLOAD DO ARQUIVO ---
    $anexoPath = '';
    $anexoNome = '';
    if (isset($_FILES['documento-empresa']) && $_FILES['documento-empresa']['error'] == UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/'; // A mesma pasta de uploads
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $anexoNome = basename($_FILES['documento-empresa']['name']);
        $safeName = preg_replace("/[^a-zA-Z0-9-_\.]/", "", str_replace(" ", "_", $anexoNome));
        $anexoPath = $uploadDir . time() . '_EMPRESA_' . $safeName;

        if (!move_uploaded_file($_FILES['documento-empresa']['tmp_name'], $anexoPath)) {
            $anexoPath = '';
            $anexoNome = 'ERRO: Upload falhou no servidor.';
        }
    } else {
        $anexoNome = 'Nenhum documento anexado.';
    }

    // --- CONSTRUÇÃO DO CORPO DO E-MAIL ---
    $emailBody = "<!DOCTYPE html><html><head><style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; }
                    .container { width: 90%; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                    h2 { color: #EA4335; } /* Tema Vermelho */
                    strong { color: #005A9C; }
                  </style></head><body><div class='container'>";
    $emailBody .= "<h2>Novo Contato de Empresa Parceira (Site APIT)</h2>";
    $emailBody .= "<p><strong>Empresa:</strong> " . $empresa . "</p>";
    $emailBody .= "<p><strong>Representante:</strong> " . $representante . "</p>";
    $emailBody .= "<p><strong>CNPJ:</strong> " . $cnpj . "</p>";
    $emailBody .= "<p><strong>Ramo:</strong> " . $ramo . "</p>";
    $emailBody .= "<hr>";
    $emailBody .= "<p><strong>E-mail:</strong> " . $email . "</p>";
    $emailBody .= "<p><strong>Telefone:</strong> " . $telefone . "</p>";
    $emailBody .= "<p><strong>Endereço:</strong> " . $rua . ", " . $bairro . ", " . $cidade . " - " . $estado . "</p>";
    $emailBody .= "<hr>";
    $emailBody .= "<p><strong>Interesse:</strong> " . $interesse . "</p>";
    $emailBody .= "<p><strong>Como Conheceu:</strong> " . $como_conheceu . "</p>";
    $emailBody .= "<p><strong>Mensagem:</strong><br>" . nl2br($mensagem) . "</p>";
    $emailBody .= "<hr>";
    $emailBody .= "<p><strong>Documento Anexo:</strong> " . $anexoNome . "</p>";
    $emailBody .= "</div></body></html>";

    // --- CONFIGURAÇÃO DO PHPMailer ---
    $mail = new PHPMailer(true);

    try {
        // Configurações do Servidor
        // $mail->SMTPDebug = SMTP::DEBUG_SERVER;                 
        $mail->isSMTP();
        $mail->Host = 'mail.apitaprendiz.org.br';             // CONFIGURE AQUI (Ex: 'mail.apitaprendiz.org.br')
        $mail->SMTPAuth = true;
        $mail->Username = 'encaminhamento@apitaprendiz.org.br'; // CONFIGURE AQUI (Seu e-mail de envio)
        $mail->Password = 'encaminhaMENTO1996@#$';                       // CONFIGURE AQUI (Sua senha de e-mail)
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = 465;                                // CONFIGURE AQUI (SSL: 465, TLS: 587)
        $mail->CharSet = 'UTF-8';

        // Remetente (Quem envia)
        $mail->setFrom('encaminhamento@apitaprendiz.org.br', 'APIT Contato Empresa');

        // Destinatário (Quem recebe)
        $mail->addAddress('rh@apitaprendiz.org.br', 'RH APIT');
        $mail->addAddress('contato@apitaprendiz.org.br', 'CONTATO APIT');

        // E-mail de resposta
        $mail->addReplyTo($email, $representante);

        // Anexos
        if ($anexoPath != '') {
            $mail->addAttachment($anexoPath, $anexoNome);
        }

        // Conteúdo
        $mail->isHTML(true);
        $mail->Subject = 'Novo Contato de Empresa (Site): ' . $empresa;
        $mail->Body = $emailBody;
        $mail->AltBody = 'Novo contato de empresa recebido de ' . $empresa . ' (Email: ' . $email . '). Anexo: ' . $anexoNome;

        $mail->send();

        // Redireciona para a página de sucesso
        header("Location: " . $redirectSuccess);
        exit;

    } catch (Exception $e) {
        echo "Erro ao enviar a mensagem. Por favor, tente novamente mais tarde. Erro: {$mail->ErrorInfo}";
    }

} else {
    // Se não for POST, redireciona para a home
    header("Location: index.html");
    exit;
}
?>