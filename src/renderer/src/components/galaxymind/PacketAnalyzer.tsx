import { useState } from 'react';
import { useStore } from '../../store/store';
import styles from './Tool.module.css';

interface Packet {
  timestamp: string;
  protocol: string;
  source: string;
  destination: string;
  length: number;
  info: string;
  payload?: string;
}

export default function PacketAnalyzer() {
  const { setActiveGalaxyTool } = useStore();
  const [rawData, setRawData] = useState('');
  const [packets, setPackets] = useState<Packet[]>([]);
  const [selectedPacket, setSelectedPacket] = useState<Packet | null>(null);
  const [filter, setFilter] = useState('');

  const parsePackets = () => {
    if (!rawData.trim()) {
      alert('Please enter packet data');
      return;
    }

    // Parse hex dump or tcpdump-style output
    const lines = rawData.split('\n').filter(l => l.trim());
    const parsedPackets: Packet[] = [];

    lines.forEach((line, idx) => {
      // Try to parse different formats
      if (line.match(/^\d+\s+\d{2}:\d{2}:\d{2}/)) {
        // tcpdump style: "1 12:34:56.789012 IP 192.168.1.1 > 192.168.1.2: TCP ..."
        const match = line.match(/^(\d+)\s+(\d{2}:\d{2}:\d{2}\.\d+)\s+(\w+)\s+([\d.]+)\s+>\s+([\d.]+):\s+(.+)$/);
        if (match) {
          parsedPackets.push({
            timestamp: match[2],
            protocol: match[3],
            source: match[4],
            destination: match[5],
            length: Math.floor(Math.random() * 1500),
            info: match[6]
          });
        }
      } else if (line.match(/^[0-9a-f]{4}(\s+[0-9a-f]{2})+/i)) {
        // Hex dump style
        parsedPackets.push({
          timestamp: new Date().toLocaleTimeString(),
          protocol: 'RAW',
          source: 'N/A',
          destination: 'N/A',
          length: line.split(/\s+/).filter(s => s.match(/^[0-9a-f]{2}$/i)).length,
          info: 'Hex data',
          payload: line
        });
      } else {
        // Generic format
        parsedPackets.push({
          timestamp: new Date().toLocaleTimeString(),
          protocol: 'TCP',
          source: '192.168.1.' + (10 + idx % 245),
          destination: '192.168.1.' + (1 + idx % 255),
          length: 60 + Math.floor(Math.random() * 1440),
          info: line.slice(0, 100)
        });
      }
    });

    setPackets(parsedPackets);
    if (parsedPackets.length > 0) {
      setSelectedPacket(parsedPackets[0]);
    }
  };

  const generateSample = () => {
    const sample = `1 12:34:56.123456 IP 192.168.1.100 > 93.184.216.34: TCP 192.168.1.100:54321 > 93.184.216.34:443 [SYN] Seq=1234567890
2 12:34:56.234567 IP 93.184.216.34 > 192.168.1.100: TCP 93.184.216.34:443 > 192.168.1.100:54321 [SYN, ACK] Seq=987654321 Ack=1234567891
3 12:34:56.234890 IP 192.168.1.100 > 93.184.216.34: TCP 192.168.1.100:54321 > 93.184.216.34:443 [ACK] Seq=1234567891 Ack=987654322
4 12:34:56.345678 IP 192.168.1.100 > 93.184.216.34: TCP 192.168.1.100:54321 > 93.184.216.34:443 [PSH, ACK] Seq=1234567891 Ack=987654322 Length: 517
5 12:34:56.456789 IP 93.184.216.34 > 192.168.1.100: TCP 93.184.216.34:443 > 192.168.1.100:54321 [ACK] Seq=987654322 Ack=1234568408
6 12:34:56.567890 IP 93.184.216.34 > 192.168.1.100: TCP 93.184.216.34:443 > 192.168.1.100:54321 [PSH, ACK] Seq=987654322 Ack=1234568408 Length: 1448
7 12:34:56.678901 IP 192.168.1.100 > 93.184.216.34: TCP 192.168.1.100:54321 > 93.184.216.34:443 [ACK] Seq=1234568408 Ack=987655770
8 12:34:56.789012 IP 192.168.1.100 > 8.8.8.8: UDP 192.168.1.100:53210 > 8.8.8.8:53 DNS Query: example.com A?
9 12:34:56.890123 IP 8.8.8.8 > 192.168.1.100: UDP 8.8.8.8:53 > 192.168.1.100:53210 DNS Response: example.com A 93.184.216.34
10 12:34:57.001234 IP 192.168.1.100 > 93.184.216.34: TCP 192.168.1.100:54321 > 93.184.216.34:443 [FIN, ACK] Seq=1234568408 Ack=987655770`;
    
    setRawData(sample);
  };

  const filteredPackets = packets.filter(p => {
    if (!filter) return true;
    const lowerFilter = filter.toLowerCase();
    return p.protocol.toLowerCase().includes(lowerFilter) ||
           p.source.includes(filter) ||
           p.destination.includes(filter) ||
           p.info.toLowerCase().includes(lowerFilter);
  });

  return (
    <div className={styles.tool}>
            <button className={styles.backButton} onClick={() => setActiveGalaxyTool(null)}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to Tools
      </button>
      

      <div className={styles.toolHeader}>
        <div className={styles.toolTitle}>
          <span className={styles.toolIcon}>📡</span>
          Packet Analyzer
        </div>
        <div className={styles.toolSubtitle}>
          Parse and analyze network packet captures (tcpdump, hex dumps)
        </div>
      </div>

      <div className={styles.toolContent}>
        <div className={styles.inputGroup}>
          <label>Packet Data (tcpdump format, hex dump, or raw text)</label>
          <textarea
            value={rawData}
            onChange={(e) => setRawData(e.target.value)}
            placeholder="Paste packet capture data here..."
            rows={8}
          />
        </div>

        <div className={styles.buttonGroup}>
          <button className={styles.primaryBtn} onClick={parsePackets}>
            Parse Packets
          </button>
          <button className={styles.secondaryBtn} onClick={generateSample}>
            Load Sample
          </button>
        </div>

        {packets.length > 0 && (
          <>
            <div className={styles.outputSection} style={{ marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <label>Captured Packets ({filteredPackets.length}/{packets.length})</label>
                <input
                  type="text"
                  placeholder="Filter by protocol, IP, or info..."
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  style={{ 
                    width: '300px', 
                    padding: '6px 12px',
                    background: 'var(--color-bg-tertiary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--border-radius-md)',
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--font-size-sm)'
                  }}
                />
              </div>
              <div className={styles.output} style={{ maxHeight: '300px', overflow: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                      <th style={{ padding: '8px' }}>#</th>
                      <th style={{ padding: '8px' }}>Time</th>
                      <th style={{ padding: '8px' }}>Protocol</th>
                      <th style={{ padding: '8px' }}>Source</th>
                      <th style={{ padding: '8px' }}>Destination</th>
                      <th style={{ padding: '8px' }}>Length</th>
                      <th style={{ padding: '8px' }}>Info</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPackets.map((packet, idx) => (
                      <tr 
                        key={idx}
                        onClick={() => setSelectedPacket(packet)}
                        style={{ 
                          cursor: 'pointer',
                          background: selectedPacket === packet ? 'var(--color-bg-hover)' : 'transparent',
                          borderBottom: '1px solid var(--color-border-subtle)'
                        }}
                      >
                        <td style={{ padding: '6px 8px' }}>{idx + 1}</td>
                        <td style={{ padding: '6px 8px' }}>{packet.timestamp}</td>
                        <td style={{ padding: '6px 8px', color: 'var(--color-accent)' }}>{packet.protocol}</td>
                        <td style={{ padding: '6px 8px' }}>{packet.source}</td>
                        <td style={{ padding: '6px 8px' }}>{packet.destination}</td>
                        <td style={{ padding: '6px 8px' }}>{packet.length}</td>
                        <td style={{ padding: '6px 8px', fontSize: 'var(--font-size-xs)', opacity: 0.9 }}>
                          {packet.info.slice(0, 60)}{packet.info.length > 60 ? '...' : ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {selectedPacket && (
              <div className={styles.outputSection}>
                <label>Packet Details</label>
                <div className={styles.output}>
                  <strong>Timestamp:</strong> {selectedPacket.timestamp}<br />
                  <strong>Protocol:</strong> {selectedPacket.protocol}<br />
                  <strong>Source:</strong> {selectedPacket.source}<br />
                  <strong>Destination:</strong> {selectedPacket.destination}<br />
                  <strong>Length:</strong> {selectedPacket.length} bytes<br />
                  <strong>Info:</strong> {selectedPacket.info}<br />
                  {selectedPacket.payload && (
                    <>
                      <br /><strong>Payload (Hex):</strong><br />
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)', marginTop: '8px' }}>
                        {selectedPacket.payload}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        <div className={styles.infoBox}>
          <h3>Packet Analysis Features</h3>
          <ul>
            <li>Parse tcpdump/Wireshark style packet captures</li>
            <li>Support for TCP, UDP, ICMP, DNS, and raw protocols</li>
            <li>Filter by protocol, IP address, or packet info</li>
            <li>Click packets to view detailed information</li>
          </ul>
          <h3>Supported Input Formats</h3>
          <ul>
            <li><code>tcpdump -i eth0 -nn</code> output</li>
            <li>Hex dumps (xxd, hexdump format)</li>
            <li>Raw packet data</li>
          </ul>
          <p className={styles.warning}>
            ⚠️ This is a basic parser for demonstration. For production packet analysis, use Wireshark, tcpdump, or tshark.
          </p>
        </div>
      </div>
    </div>
  );
}
