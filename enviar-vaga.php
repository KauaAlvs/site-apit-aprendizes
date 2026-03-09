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

    // --- COLETA DOS DADOS DO FORMULÁRIO (POP-UP) ---
    $nome = strip_tags(trim($_POST["vaga-nome"]));
    $email = filter_var(trim($_POST["vaga-email"]), FILTER_SANITIZE_EMAIL);
    $telefone = trim($_POST["vaga-telefone"]);
    $vagaTitulo = trim($_POST["vaga-titulo"]); // Vaga específica
    $vagaDesc = trim($_POST["vaga-desc"]);   // Descrição da vaga

    // --- LÓGICA DE UPLOAD DO ARQUIVO ---
    $anexoPath = '';
    $anexoNome = '';
    if (isset($_FILES['vaga-curriculo']) && $_FILES['vaga-curriculo']['error'] == UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/'; // Crie esta pasta no seu servidor e dê permissão de escrita (755 ou 777)
        // Garante que o diretório exista
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $anexoNome = basename($_FILES['vaga-curriculo']['name']);
        // Renomeia o arquivo para evitar conflitos
        $safeName = preg_replace("/[^a-zA-Z0-9-_\.]/", "", str_replace(" ", "_", $anexoNome));
        $anexoPath = $uploadDir . time() . '_VAGA_' . $safeName;

        if (!move_uploaded_file($_FILES['vaga-curriculo']['tmp_name'], $anexoPath)) {
            $anexoPath = '';
            $anexoNome = 'ERRO: Upload falhou no servidor.';
        }
    } else {
        // É obrigatório no pop-up, mas verificamos
        $anexoNome = 'ERRO: Nenhum currículo anexado (obrigatório).';
    }

    // --- CONSTRUÇÃO DO CORPO DO E-MAIL ---
    $emailBody = "<!DOCTYPE html><html><head><style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; }
                    .container { width: 90%; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                    h2 { color: #7928CA; }
                    strong { color: #005A9C; }
                    .vaga { background-color: #f7f9fc; padding: 15px; border-radius: 5px; }
                  </style></head><body><div class='container'>";
    $emailBody .= "<h2>Nova Candidatura à Vaga (Site APIT)</h2>";
    $emailBody .= "<p><strong>Nome do Candidato:</strong> " . $nome . "</p>";
    $emailBody .= "<p><strong>Email:</strong> " . $email . "</p>";
    $emailBody .= "<p><strong>Telefone:</strong> " . $telefone . "</p>";
    $emailBody .= "<hr>";
    $emailBody .= "<h3>Vaga de Interesse:</h3>";
    $emailBody .= "<div class='vaga'>";
    $emailBody .= "<p><strong>" . $vagaTitulo . "</strong></p>";
    $emailBody .= "<p><em>" . $vagaDesc . "</em></p>";
    $emailBody .= "</div>";
    $emailBody .= "<hr>";
    $emailBody .= "<p><strong>Currículo:</strong> " . $anexoNome . "</p>";
    $emailBody .= "</div></body></html>";

    // --- CONFIGURAÇÃO DO PHPMailer ---
    $mail = new PHPMailer(true);

    try {
        // Configurações do Servidor
        // Configurações do Servidor
        // $mail->SMTPDebug = SMTP::DEBUG_SERVER;                 
        $mail->isSMTP();
        $mail->Host = 'mail.apitaprendiz.org.br';             // Veio da sua imagem
        $mail->SMTPAuth = true;
        $mail->Username = 'encaminhamento@apitaprendiz.org.br'; // Veio da sua imagem
        $mail->Password = 'encaminhaMENTO1996@#$';                       // CONFIGURE AQUI: A senha que VOCÊ criou para esse e-mail
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;         // Corresponde à porta 465
        $mail->Port = 465;                                // Veio da sua imagem
        $mail->CharSet = 'UTF-8';

        // Remetente
        $mail->setFrom('encaminhamento@apitaprendiz.org.br', 'APIT Candidatura Vaga');

        // Destinatário
        $mail->addAddress('rh@apitaprendiz.org.br', 'RH APIT');
        $mail->addAddress('contato@apitaprendiz.org.br', 'CONTATO APIT');

        // E-mail de resposta
        $mail->addReplyTo($email, $nome);

        // Anexos
        if ($anexoPath != '') {
            $mail->addAttachment($anexoPath, $anexoNome);
        }

        // Conteúdo
        $mail->isHTML(true);
        $mail->Subject = 'CANDIDATURA VAGA: ' . $vagaTitulo . ' (de ' . $nome . ')';
        $mail->Body = $emailBody;
        $mail->AltBody = 'Nova candidatura para a vaga ' . $vagaTitulo . ' de ' . $nome . ' (Email: ' . $email . '). Currículo: ' . $anexoNome;

        $mail->send();

        // Redireciona para a nova página de sucesso
        header("Location: obrigado-vaga.html");
        exit;

    } catch (Exception $e) {
        echo "Erro ao enviar a mensagem. Por favor, tente novamente mais tarde. Erro: {$mail->ErrorInfo}";
    }

} else {
    header("Location: index.html");
    exit;
}
?>