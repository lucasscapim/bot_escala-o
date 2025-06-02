const fs = require('fs');

module.exports = function generateHTML(messages) {
  const rows = messages.map(m => `
    <div class="message">
      <div class="avatar">
        <img src="${m.avatar}" alt="avatar">
      </div>
      <div class="content">
        <div class="header">
          <span class="author">${m.author}</span>
          <span class="timestamp">${new Date(m.createdAt).toLocaleString('pt-BR')}</span>
          ${m.editedAt ? '<span class="edited">(editado)</span>' : ''}
        </div>
        <div class="body">${format(m.content)}</div>
        ${m.attachments ? `
          <div class="attachments">
            ${m.attachments.split(', ').map(url => `<a href="${url}" target="_blank">📎 Anexo</a>`).join('<br>')}
          </div>` : ''}
        ${m.reactions ? `<div class="reactions">${m.reactions}</div>` : ''}
      </div>
    </div>
  `).join('\n');

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Backup Discord</title>
      <style>
        body { background-color: #2c2f33; color: #dcddde; font-family: sans-serif; padding: 20px; }
        .message { display: flex; margin-bottom: 15px; }
        .avatar img { width: 40px; height: 40px; border-radius: 50%; }
        .content { margin-left: 10px; }
        .header { font-weight: bold; }
        .timestamp { font-size: 0.8em; color: #aaa; margin-left: 6px; }
        .body { white-space: pre-wrap; }
        .attachments a { color: #00b0f4; font-size: 0.9em; }
        .reactions { background: #36393f; padding: 2px 5px; border-radius: 5px; margin-top: 5px; }
      </style>
    </head>
    <body>
      <h1>Backup de Mensagens</h1>
      ${rows}
    </body>
    </html>
  `;

  fs.writeFileSync('backup.html', html, 'utf8');
};

function format(content) {
  return content.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br>");
}
