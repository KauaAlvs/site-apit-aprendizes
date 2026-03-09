<?php
// Importa as classes do PHPMailer para o namespace global
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

// Carrega os arquivos do PHPMailer
// ATENÇÃO: Certifique-se que este caminho está correto.
// Recomendo criar uma pasta 'PHPMailer' na raiz e colocar a pasta 'src' baixada dentro dela.
require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

// Verifica se o formulário foi enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // --- COLETA DOS DADOS DO FORMULÁRIO ---
    $nome = strip_tags(trim($_POST["Nome_Completo"]));
    $email = filter_var(trim($_POST["E-mail"]), FILTER_SANITIZE_EMAIL);
    $nascimento = trim($_POST["Data_de_Nascimento"]);
    $telefone = trim($_POST["Telefone"]);
    $escolaridade = trim($_POST["Escolaridade"]);
    $cep = trim($_POST["CEP"]);
    $cidade = trim($_POST["Cidade"]);
    $estado = trim($_POST["Estado"]);
    $mensagem = strip_tags(trim($_POST["Mensagem"]));
    $redirectSuccess = trim($_POST["_next"]); // Página de obrigado

    // --- LÓGICA DE UPLOAD DO ARQUIVO ---
    $anexoPath = '';
    $anexoNome = '';
    if (isset($_FILES['curriculo']) && $_FILES['curriculo']['error'] == UPLOAD_ERR_OK) {
        $uploadDir = 'uploads/'; // Crie esta pasta no seu servidor e dê permissão de escrita (755 ou 777)
        // Garante que o diretório exista
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $anexoNome = basename($_FILES['curriculo']['name']);
        // Renomeia o arquivo para evitar conflitos e caracteres especiais
        $safeName = preg_replace("/[^a-zA-Z0-9-_\.]/", "", str_replace(" ", "_", $anexoNome));
        $anexoPath = $uploadDir . time() . '_' . $safeName;

        if (!move_uploaded_file($_FILES['curriculo']['tmp_name'], $anexoPath)) {
            // Se falhar o upload, não é fatal, apenas anota no email
            $anexoPath = ''; // Reseta o caminho
            $anexoNome = 'ERRO: Upload falhou no servidor.';
        }
    } else {
        $anexoNome = 'Nenhum currículo anexado.';
    }

    // --- CONSTRUÇÃO DO CORPO DO E-MAIL ---
    $emailBody = "<!DOCTYPE html><html><head><style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; }
                    .container { width: 90%; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
                    h2 { color: #7928CA; }
                    strong { color: #005A9C; }
                  </style></head><body><div class='container'>";
    $emailBody .= "<h2>Nova Inscrição de Jovem Aprendiz (Site APIT)</h2>";
    $emailBody .= "<p><strong>Nome:</strong> " . $nome . "</p>";
    $emailBody .= "<p><strong>Email:</strong> " . $email . "</p>";
    $emailBody .= "<p><strong>Telefone:</strong> " . $telefone . "</p>";
    $emailBody .= "<p><strong>Data de Nascimento:</strong> " . $nascimento . "</p>";
    $emailBody .= "<p><strong>Escolaridade:</strong> " . $escolaridade . "</p>";
    $emailBody .= "<hr>";
    $emailBody .= "<p><strong>Endereço:</strong> " . $cidade . " - " . $estado . " (CEP: " . $cep . ")</p>";
    $emailBody .= "<p><strong>Mensagem:</strong><br>" . nl2br($mensagem) . "</p>";
    $emailBody .= "<hr>";
    $emailBody .= "<p><strong>Currículo:</strong> " . $anexoNome . "</p>";
    $emailBody .= "</div></body></html>";

    // --- CONFIGURAÇÃO DO PHPMailer ---
    $mail = new PHPMailer(true);

    try {
        // Configurações do Servidor
        // $mail->SMTPDebug = SMTP::DEBUG_SERVER;                 // Habilite para debug detalhado
        // Configurações do Servidor
        // $mail->SMTPDebug = SMTP::DEBUG_SERVER;                 
        $mail->isSMTP();
        $mail->Host = 'mail.apitaprendiz.org.br';
        $mail->SMTPAuth = true;
        $mail->Username = 'encaminhamento@apitaprendiz.org.br';
        $mail->Password = 'encaminhaMENTO1996@#$';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;         // Corresponde à porta 465
        $mail->Port = 465;
        $mail->CharSet = 'UTF-8';

        // Remetente
        $mail->setFrom('encaminhamento@apitaprendiz.org.br', 'APIT Inscrições Site');

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
        $mail->Subject = 'Nova Inscrição de Aprendiz (Site): ' . $nome;
        $mail->Body = $emailBody;
        $mail->AltBody = 'Nova inscrição recebida de ' . $nome . ' (Email: ' . $email . '). Currículo: ' . $anexoNome;

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