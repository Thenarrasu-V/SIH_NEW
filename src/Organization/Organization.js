import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import './organization.css';

const OrganizationPage = () => {
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [scanStarted, setScanStarted] = useState(false);
  const [scanResults, setScanResults] = useState([]);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [currentCheckIndex, setCurrentCheckIndex] = useState(0);
  const [customizeVisible, setCustomizeVisible] = useState(false);
  const [showRuleSelection, setShowRuleSelection] = useState(false);
  const [additionalRules, setAdditionalRules] = useState([]);
  const [ruleSet, setRuleSet] = useState([]);
  const [selectedRules, setSelectedRules] = useState([]);

  const cisRules = [
    { check: "Account Management", isSafe: false, detail: "Ensure accounts are properly managed." },
    { check: "Access Control", isSafe: true, detail: "Implement proper access controls for sensitive data." },
    { check: "Audit Logs", isSafe: false, detail: "Audit logs should be enabled and properly managed." },
    { check: "Backup Procedures", isSafe: true, detail: "Regular backups should be performed and tested." },
    { check: "Firewall Configuration", isSafe: false, detail: "Firewalls should be configured to block unauthorized access." },
    { check: "Multi-factor Authentication", isSafe: false, detail: "Multi-factor authentication should be enforced." },
    { check: "Patch Management", isSafe: true, detail: "Apply patches and updates regularly to all systems." },
    { check: "Data Encryption", isSafe: true, detail: "Encrypt sensitive data both in transit and at rest." },
    { check: "Intrusion Detection Systems", isSafe: false, detail: "Implement intrusion detection systems to monitor suspicious activity." },
    { check: "Security Policies", isSafe: true, detail: "Document and enforce security policies." },
    { check: "Network Segmentation", isSafe: true, detail: "Segment networks to limit access to sensitive information." },
    { check: "Vulnerability Management", isSafe: false, detail: "Regularly scan for and address vulnerabilities." },
    { check: "Endpoint Protection", isSafe: true, detail: "Use endpoint protection tools to secure devices." },
    { check: "Incident Response Plan", isSafe: false, detail: "Develop and maintain an incident response plan." },
    { check: "User Training", isSafe: true, detail: "Provide regular security training to users." },
    { check: "Secure Configuration", isSafe: false, detail: "Ensure systems are securely configured and hardened." },
    { check: "Remote Access", isSafe: true, detail: "Secure remote access methods to protect from unauthorized access." },
    { check: "Physical Security", isSafe: true, detail: "Implement physical security controls to protect hardware." },
    { check: "System Monitoring", isSafe: false, detail: "Monitor systems for abnormal activities and threats." },
    { check: "Data Loss Prevention", isSafe: true, detail: "Implement data loss prevention measures to protect sensitive data." },
    { check: "Application Security", isSafe: false, detail: "Ensure applications are secure and free from vulnerabilities." },
    { check: "Third-party Risk Management", isSafe: true, detail: "Assess and manage risks associated with third-party vendors." },
    { check: "Cloud Security", isSafe: true, detail: "Secure cloud resources and ensure data protection." }
];

const industryChecks = {
  finance: [
    { check: "Encryption Policies", isSafe: true, detail: "Encryption policies are in place to protect sensitive data during storage and transmission. Mitigation Strategy: Regularly review and update encryption protocols to ensure they meet current security standards." },
    { check: "Data Backup Procedures", isSafe: true, detail: "Data backup procedures are established and regularly performed to ensure data recovery in case of loss. Mitigation Strategy: Implement automated backups and regularly test restore processes to ensure data integrity." },
    { check: "Firewall Configuration", isSafe: false, detail: "The firewall is disabled, making your system vulnerable to external attacks. Mitigation Strategy: Enable the firewall through your system settings to block unauthorized access." },
    { check: "Access Controls", isSafe: true, detail: "Access controls are implemented to restrict unauthorized users from accessing sensitive systems and data. Mitigation Strategy: Regularly review and update access permissions based on role changes and audits." },
    { check: "Multi-factor Authentication", isSafe: false, detail: "Multi-factor authentication is not enabled, increasing the risk of unauthorized access. Mitigation Strategy: Enable multi-factor authentication for an added layer of security." },
    { check: "Intrusion Detection Systems", isSafe: true, detail: "Intrusion Detection Systems (IDS) are in place to detect and respond to suspicious activities. Mitigation Strategy: Continuously update IDS signatures and rules to improve threat detection." },
    { check: "Audit Logs", isSafe: true, detail: "Audit logs are maintained to track and review user activities and system changes. Mitigation Strategy: Regularly review audit logs and implement alerting mechanisms for suspicious activities." },
    { check: "Third-party Risk Management", isSafe: true, detail: "Third-party risk management practices are implemented to assess and manage risks associated with external vendors. Mitigation Strategy: Conduct regular assessments and audits of third-party services and their security practices." },
    { check: "Compliance with Regulations", isSafe: true, detail: "Compliance with relevant regulations and standards is ensured to meet legal and industry requirements. Mitigation Strategy: Keep up-to-date with regulatory changes and adjust policies and procedures accordingly." },
    { check: "Payment Security", isSafe: true, detail: "Payment security measures are in place to protect financial transactions and customer payment information. Mitigation Strategy: Regularly update payment processing systems to address emerging threats and vulnerabilities." },
    { check: "Customer Data Protection", isSafe: true, detail: "Customer data protection policies are enforced to safeguard personal information from unauthorized access. Mitigation Strategy: Implement data encryption and access controls to protect sensitive customer information." },
    { check: "Disaster Recovery Plan", isSafe: true, detail: "A disaster recovery plan is developed and tested to ensure business continuity in case of unexpected events. Mitigation Strategy: Regularly update and test the disaster recovery plan to address new risks and ensure effective response." }
  ],
  education: [
    { check: "Student Data Privacy", isSafe: true, detail: "Student data privacy measures are implemented to protect personal and educational information from unauthorized access. Mitigation Strategy: Ensure data encryption and access controls are in place to safeguard student information." },
    { check: "E-learning Platform Security", isSafe: true, detail: "Security protocols for e-learning platforms are in place to safeguard online educational content and user interactions. Mitigation Strategy: Regularly update platform security features and perform vulnerability assessments." },
    { check: "Network Monitoring", isSafe: false, detail: "Network monitoring is not properly configured, potentially missing suspicious activities. Mitigation Strategy: Implement comprehensive network monitoring tools to detect and respond to potential threats." },
    { check: "Device Management", isSafe: true, detail: "Device management practices are in place to secure and manage educational devices and resources. Mitigation Strategy: Implement policies for regular updates and security checks on all devices." },
    { check: "Firewall Configuration", isSafe: false, detail: "The firewall is not properly configured, which can leave your network exposed. Mitigation Strategy: Review and configure your firewall settings to block unauthorized access." },
    { check: "Access Controls", isSafe: true, detail: "Access controls are used to manage user permissions and restrict access to sensitive educational data. Mitigation Strategy: Regularly review user permissions and adjust access levels based on role and need." },
    { check: "Backup and Recovery", isSafe: true, detail: "Backup and recovery procedures are established to ensure data integrity and availability in case of loss. Mitigation Strategy: Perform regular backups and periodically test recovery procedures to ensure data can be restored." },
    { check: "Incident Response Plan", isSafe: true, detail: "An incident response plan is in place to address and manage security incidents effectively. Mitigation Strategy: Regularly update the incident response plan and conduct drills to ensure readiness for various types of incidents." },
    { check: "Third-party Vendor Security", isSafe: true, detail: "Security measures for third-party vendors are implemented to manage risks associated with external services and products. Mitigation Strategy: Conduct due diligence and regular security assessments of third-party vendors." },
    { check: "Compliance with Educational Regulations", isSafe: true, detail: "Compliance with educational regulations is maintained to adhere to legal and institutional requirements. Mitigation Strategy: Stay informed about regulatory changes and adjust policies to ensure continuous compliance." },
    { check: "Software Updates", isSafe: true, detail: "Software updates are regularly applied to keep systems secure and up-to-date. Mitigation Strategy: Implement an automated update system to ensure timely application of software patches and updates." },
    { check: "Antivirus Protection", isSafe: true, detail: "Antivirus protection is in place to detect and remove malicious software from educational systems. Mitigation Strategy: Regularly update antivirus definitions and perform scheduled scans to detect and address threats." }
  ],
  technical: [
    { check: "Code Repositories", isSafe: true, detail: "Code repositories are managed with proper access controls and security practices to protect source code. Mitigation Strategy: Implement access controls and review repository security settings to prevent unauthorized access." },
    { check: "Continuous Integration/Continuous Deployment (CI/CD)", isSafe: true, detail: "CI/CD pipelines are configured to automate the build, test, and deployment processes with security checks. Mitigation Strategy: Integrate security testing into the CI/CD pipeline to identify vulnerabilities early in the development process." },
    { check: "Security Patches", isSafe: false, detail: "Security patches are outdated or missing, increasing vulnerability. Mitigation Strategy: Regularly update and apply security patches to all systems and software to protect against known vulnerabilities." },
    { check: "Source Code Review", isSafe: true, detail: "Source code reviews are conducted to identify and fix security vulnerabilities in the code. Mitigation Strategy: Implement peer reviews and automated code analysis tools to ensure code quality and security." },
    { check: "Penetration Testing", isSafe: false, detail: "Penetration testing has not been conducted recently, leaving potential vulnerabilities unaddressed. Mitigation Strategy: Schedule regular penetration tests to identify and fix security weaknesses." },
    { check: "Access Controls", isSafe: true, detail: "Access controls are in place to manage permissions and restrict unauthorized access to technical systems. Mitigation Strategy: Regularly review and update access permissions to align with current security policies and user roles." },
    { check: "Firewall Configuration", isSafe: true, detail: "Firewalls are properly configured to protect technical systems from unauthorized access and attacks. Mitigation Strategy: Continuously monitor and update firewall rules to adapt to new threats and ensure optimal protection." },
    { check: "Intrusion Detection Systems", isSafe: true, detail: "Intrusion Detection Systems (IDS) are deployed to monitor and respond to suspicious activities in technical environments. Mitigation Strategy: Regularly update IDS signatures and perform periodic reviews to enhance threat detection capabilities." },
    { check: "Audit Logs", isSafe: true, detail: "Audit logs are maintained to track user activities and system changes for security monitoring and compliance. Mitigation Strategy: Implement log management solutions and review logs regularly to detect and respond to anomalies." },
    { check: "Software Updates", isSafe: true, detail: "Software updates are regularly applied to address security vulnerabilities and ensure system stability. Mitigation Strategy: Implement an automated update process and monitor for new updates to maintain system security." },
    { check: "Antivirus Protection", isSafe: true, detail: "Antivirus protection is implemented to detect and mitigate threats from malicious software. Mitigation Strategy: Keep antivirus software up-to-date and perform regular scans to protect against new and emerging threats." },
    { check: "Backup and Recovery", isSafe: true, detail: "Backup and recovery procedures are established to ensure data integrity and recovery in case of loss or corruption. Mitigation Strategy: Regularly test backup and recovery processes to verify their effectiveness and reliability." }
  ],
  gaming: [
    { check: "Player Data Security", isSafe: true, detail: "Player data security measures are implemented to protect personal and game-related information from unauthorized access. Mitigation Strategy: Use encryption and secure storage solutions to safeguard player data." },
    { check: "Payment Processing Security", isSafe: true, detail: "Payment processing security protocols are in place to safeguard transactions and payment information. Mitigation Strategy: Regularly review and update payment security measures to address emerging threats." },
    { check: "Network Monitoring", isSafe: false, detail: "Network monitoring is insufficient, potentially missing important threats. Mitigation Strategy: Enhance network monitoring to detect and address potential security issues." },
    { check: "Game Server Security", isSafe: true, detail: "Game server security measures are in place to protect against unauthorized access and attacks. Mitigation Strategy: Implement regular security reviews and updates to maintain server protection." },
    { check: "DDoS Protection", isSafe: true, detail: "DDoS protection mechanisms are in place to defend against distributed denial-of-service attacks. Mitigation Strategy: Regularly test and update DDoS protection systems to ensure they can handle evolving threats." },
    { check: "Access Controls", isSafe: true, detail: "Access controls are used to manage permissions and restrict unauthorized access to gaming systems. Mitigation Strategy: Regularly review and adjust access permissions to align with security policies and user needs." },
    { check: "Encryption Policies", isSafe: true, detail: "Encryption policies are in place to protect data in transit and at rest within the gaming environment. Mitigation Strategy: Ensure encryption standards are up-to-date and review policies regularly for compliance with best practices." },
    { check: "Firewall Configuration", isSafe: false, detail: "Firewall settings are not configured properly, exposing the system to attacks. Mitigation Strategy: Review and configure firewall settings to ensure protection against unauthorized access." },
    { check: "Incident Response Plan", isSafe: true, detail: "An incident response plan is developed to handle and mitigate security incidents effectively. Mitigation Strategy: Regularly update the incident response plan and conduct training exercises to ensure readiness." },
    { check: "Compliance with Gaming Regulations", isSafe: true, detail: "Compliance with gaming regulations is maintained to adhere to legal and industry standards. Mitigation Strategy: Keep abreast of regulatory changes and update policies to ensure ongoing compliance." },
    { check: "Anti-cheat Systems", isSafe: true, detail: "Anti-cheat systems are implemented to prevent and address cheating and unfair practices in games. Mitigation Strategy: Continuously update and enhance anti-cheat mechanisms to stay ahead of new cheating methods." },
    { check: "Backup and Recovery", isSafe: true, detail: "Backup and recovery procedures are established to ensure data integrity and availability in case of loss. Mitigation Strategy: Regularly test backup and recovery processes to ensure effectiveness and data safety." }
  ]
};

  useEffect(() => {
    if (scanStarted && currentCheckIndex < ruleSet.length) {
      const timer = setTimeout(() => {
        setScanResults(prevResults => {
          const newResults = [...prevResults];
          newResults[currentCheckIndex] = {
            ...newResults[currentCheckIndex],
            status: 'checking'
          };
          return newResults;
        });

        // Simulate checking the rule
        setTimeout(() => {
          setScanResults(prevResults => {
            const newResults = [...prevResults];
            const randomResult = Math.random() > 0.5 ? 'safe' : 'unsafe';
            newResults[currentCheckIndex] = {
              ...newResults[currentCheckIndex],
              status: randomResult
            };
            return newResults;
          });
          setCurrentCheckIndex(prevIndex => prevIndex + 1);
        }, 1000);

        if (currentCheckIndex === ruleSet.length - 1) {
          setScanCompleted(true);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [scanStarted, currentCheckIndex, ruleSet.length]);

  const handleIndustryChange = (event) => {
    const selectedIndustry = event.target.value;
    setSelectedIndustry(selectedIndustry);
    resetScanState();
    setRuleSet(industryChecks[selectedIndustry] || []);
  };

  const resetScanState = () => {
    setScanStarted(false);
    setScanResults([]);
    setScanCompleted(false);
    setCurrentCheckIndex(0);
    setCustomizeVisible(false);
    setShowRuleSelection(false);
    setAdditionalRules([]);
    setSelectedRules([]);
  };

  const handleScanClick = () => {
    const initialResults = ruleSet.map(rule => ({
      check: rule.check,
      status: '' // Initial status is empty
    }));
    setScanResults(initialResults);
    setScanStarted(true);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica');
    doc.setFontSize(16);
    doc.text(`Scan Results for ${selectedIndustry} Industry`, 10, 10);
    doc.setFontSize(12);
  
    let yOffset = 20;
    
    scanResults.forEach((result, index) => {
      if (index > 0) {
        yOffset += 10;
      }
  
      const status = result.status === 'safe' ? '✔ Safe' : result.status === 'unsafe' ? '✖ Unsafe' : '...';
      doc.text(
        `${result.check}: ${status}`,
        10,
        yOffset
      );
      yOffset += 10;
  
      if (result.status === 'unsafe') {
        doc.setFontSize(10);
        
        // Get the detail from industryChecks
        const detail = industryChecks[selectedIndustry]?.find(rule => rule.check === result.check)?.detail || 'No additional details provided.';
        const mitigationText = detail.includes('Mitigation Strategy:') ? detail : `Mitigation: ${detail}`;
        
        // Detail text
        doc.text(detail, 10, yOffset, { maxWidth: 180 });
        yOffset += detail.split(' ').length * 5;
  
        // Mitigation text
        doc.text(mitigationText, 10, yOffset, { maxWidth: 180 });
        yOffset += mitigationText.split(' ').length * 5;
  
        doc.setFontSize(12);
      }
    });
  
    doc.save(`${selectedIndustry}_Scan_Results.pdf`);
  };  

  const handleCustomizeClick = () => {
    setCustomizeVisible(!customizeVisible);
  };

  const handleAddRule = () => {
    setShowRuleSelection(true);
  };

  const handleRuleChange = (event, index) => {
    const isChecked = event.target.checked;
    setSelectedRules(prevSelectedRules => {
      const newSelectedRules = [...prevSelectedRules];
      if (isChecked) {
        newSelectedRules.push(cisRules[index]);
      } else {
        const ruleIndex = newSelectedRules.findIndex(rule => rule.check === cisRules[index].check);
        if (ruleIndex > -1) {
          newSelectedRules.splice(ruleIndex, 1);
        }
      }
      return newSelectedRules;
    });
  };

  const handleSubmitRules = () => {
    setAdditionalRules(selectedRules);
    setRuleSet(prevRules => [...prevRules, ...selectedRules]);
    setShowRuleSelection(false);
    alert('Rules have been successfully submitted.');
  };

  const handleCustomRuleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const rules = JSON.parse(e.target.result);

          if (Array.isArray(rules)) {
            setRuleSet(prevRules => [...prevRules, ...rules]);
            alert('Rules have been successfully uploaded.');
          } else {
            alert('Rules have been successfully uploaded.');
          }
        } catch (error) {
          alert('Failed to parse the file. Please ensure it is a valid JSON file.');
          console.error('File parsing error:', error);
        }
      };
      reader.readAsText(file);
    } else {
      alert('No file selected.');
    }
  };

  return (
    <div className="organization-container">
      <div className="dropdown-container">
        <h1 className="page-title">Select Industry Type</h1>
        <select
          className="industry-dropdown"
          onChange={handleIndustryChange}
          value={selectedIndustry}
        >
          <option value="">Select Industry</option>
          <option value="finance">Finance</option>
          <option value="education">Education</option>
          <option value="technical">Technical</option>
          <option value="gaming">Gaming</option>
        </select>
      </div>
        <h1 className="page-title">Select System Type</h1>
        <select
          className="industry-dropdown"
          onChange={handleIndustryChange}
          value={selectedIndustry}
        >
          <option value="">Select System Type</option>
          <option value="finance">Windows 11</option>
          <option value="education">Linux</option>
          <option value="technical">Cloud</option>
          <option value="gaming">Mac</option>
        </select>

      {selectedIndustry && (
        <div className="action-buttons">
          <button className="customize-button" onClick={handleCustomizeClick}>
            Customize
          </button>
          <button className="scan-button" onClick={handleScanClick}>
            Scan
          </button>
        </div>
      )}

      {customizeVisible && (
        <div className="customize-options">
          <button className="add-rule-button" onClick={handleAddRule}>
            Add Rule
          </button>
          <button className="add-custom-rule-button">
            <label htmlFor="custom-rule-upload">Add Customized Rule</label>
            <input
              id="custom-rule-upload"
              type="file"
              accept=".json"
              onChange={handleCustomRuleFileUpload}
              style={{ display: "none" }}
            />
          </button>
        </div>
      )}

      {showRuleSelection && (
        <div className="rule-selection">
          <h2>Select Additional Rules</h2>
          {cisRules.map((rule, index) => (
            <div key={index}>
              <input
                type="checkbox"
                onChange={(event) => handleRuleChange(event, index)}
              />
              <label>{rule.check}</label>
            </div>
          ))}
          <button className="submit-rules-button" onClick={handleSubmitRules}>
            Submit Rules
          </button>
        </div>
      )}

      {scanStarted && (
        <div className="scan-results">
          <h2>Scan Results:</h2>
          {scanResults.map((result, index) => (
            <div className="scan-result" key={index}>
              <div className="result-check">{result.check}</div>
              <div
                className={`result-status ${
                  result.status === 'safe'
                    ? 'safe'
                    : result.status === 'unsafe'
                    ? 'unsafe'
                    : 'checking'
                }`}
              >
                {result.status === 'safe'
                  ? '✔ Safe'
                  : result.status === 'unsafe'
                  ? '✖ Unsafe'
                  : 'Checking...'}
              </div>
            </div>
          ))}
          {scanCompleted && (
            <button className="export-button" onClick={handleExportPDF}>
              Export Results to PDF
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default OrganizationPage;
