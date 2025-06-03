import React, { useEffect, useState, useRef } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  ReferenceDot,
  ReferenceLine
} from 'recharts';
import { fetchHistoricalData } from '../services/api';
import { useParams } from 'react-router-dom';
import mockDataImport from './mock_data.json';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const optimalRanges = {
  temperature: { min: 18, max: 26 },
  humidity: { min: 30, max: 70 },
  soilMoisture: { min: 10, max: 50 },
  lightLevel: { min: 2, max: 5 }
};

const recommendations = {
  temperature: {
    min: 'Temperature is low, consider heating.',
    max: 'Temperature is high, check the ventilation.'
  },
  humidity: {
    min: 'Air is dry, consider humidifying.',
    max: 'Air is too humid, check the ventilation.'
  },
  soilMoisture: {
    min: 'Soil is dry, consider watering.',
    max: 'Soil is overwatered, reduce watering.'
  },
  lightLevel: {
    min: 'Light is low, consider adding lighting.',
    max: 'Light is too strong, protect plants with shading.'
  }
};

const metrics = {
  temperature: { label: 'Teplota (°C)', color: '#ff7300' },
  humidity: { label: 'Vlhkost vzduchu (%)', color: '#28a745' },
  soilMoisture: { label: 'Vlhkost půdy (%)', color: '#8884d8' },
  lightLevel: { label: 'Světlo (lx)', color: '#00c49f' }
};

const GreenhouseWeeklyChart = () => {
  const [data, setData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('temperature');
  const [displayType, setDisplayType] = useState('day');
  const [minPoint, setMinPoint] = useState(null);
  const [maxPoint, setMaxPoint] = useState(null);
  const [metricLimits, setMetricLimits] = useState({ min: 0, max: 0 });
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [filteredData, setFilteredData] = useState([]);
  const { greenhouse } = useParams();
  const greenhouseId = greenhouse === 'sklenik1' ? 1 : 2;
  const chartRef = useRef(null);
  const statsRef = useRef(null);

  // Funkce pro získání dat týdne z vybraného data
  const getWeekDates = (selectedDate) => {
    const date = new Date(selectedDate);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Upravit pro pondělí jako první den
    const monday = new Date(date.setDate(diff));
    const dates = [];
    
    for(let i = 0; i < 7; i++) {
      const currentDate = new Date(monday);
      currentDate.setDate(monday.getDate() + i);
      dates.push(currentDate.toISOString().split('T')[0]);
    }
    return dates;
  };

  // Funkce pro získání dat měsíce z vybraného data
  const getMonthDates = (selectedDate) => {
    const date = new Date(selectedDate);
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const dates = [];
    
    for(let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }
    return dates;
  };

  // Funkce pro filtrování dat podle dne, týdne nebo měsíce
  useEffect(() => {
    if (!selectedDate || !data.length) {
      console.log('No date selected or no data available');
      setFilteredData([]);
      return;
    }
    
    console.log('Filtering data for:', displayType);
    console.log('Selected date:', selectedDate);
    
    let filtered;
    if (displayType === 'day') {
      // Filtrování pro jeden den
      filtered = data.filter(item => {
        const itemDate = item.timestamp.split('T')[0];
        return itemDate === selectedDate;
      });
    } else if (displayType === 'week') {
      // Filtrování pro týden
      const weekDates = getWeekDates(selectedDate);
      console.log('Week dates:', weekDates);
      
      filtered = data.filter(item => {
        const itemDate = item.timestamp.split('T')[0];
        const itemHour = new Date(item.timestamp).getHours();
        return weekDates.includes(itemDate) && itemHour === 15;
      });
    } else {
      // Filtrování pro měsíc
      const monthDates = getMonthDates(selectedDate);
      console.log('Month dates:', monthDates);
      
      filtered = data.filter(item => {
        const itemDate = item.timestamp.split('T')[0];
        const itemHour = new Date(item.timestamp).getHours();
        return monthDates.includes(itemDate) && itemHour === 15;
      });
    }

    // Seřadíme data podle času
    filtered.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    console.log('Filtered data length:', filtered.length);
    setFilteredData(filtered);
  }, [selectedDate, data, displayType]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const from = new Date();
        from.setDate(from.getDate() - 7);
        const to = new Date();
        
        const historicalData = await fetchHistoricalData(greenhouseId, from.toISOString(), to.toISOString());
        
        if (historicalData && historicalData.length > 0) {
          const formattedData = historicalData.map(entry => ({
            timestamp: entry.timestamp,
            temperature: entry.temperature,
            humidity: entry.humidity,
            soilMoisture: entry.soil_moisture,
            lightLevel: entry.light_level
          }));
          setData(formattedData);
        } else {
          const formattedMockData = mockDataImport.map(entry => ({
            timestamp: entry.timestamp,
            temperature: entry.temperature,
            humidity: entry.humidity,
            soilMoisture: entry.soil_moisture,
            lightLevel: entry.light_level
          }));
          setData(formattedMockData);
        }
      } catch (error) {
        const formattedMockData = mockDataImport.map(entry => ({
          timestamp: entry.timestamp,
          temperature: entry.temperature,
          humidity: entry.humidity,
          soilMoisture: entry.soil_moisture,
          lightLevel: entry.light_level
        }));
        setData(formattedMockData);
      }
    };
    fetchData();
  }, [greenhouseId]);

  useEffect(() => {
    if (data.length > 0) {
      const values = data.map(d => d[selectedMetric]);
      const min = Math.min(...values);
      const max = Math.max(...values);
      setMetricLimits({ min, max });

      const minDataPoint = data.find(d => d[selectedMetric] === min);
      const maxDataPoint = data.find(d => d[selectedMetric] === max);
      setMinPoint(minDataPoint);
      setMaxPoint(maxDataPoint);
    }
  }, [selectedMetric, data]);

  const formatXAxis = (tickItem) => {
    const date = new Date(tickItem);
    if (isNaN(date.getTime())) {
      return '';
    }
    if (displayType === 'day') {
      return date.toLocaleString('cs-CZ', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else if (displayType === 'week') {
      return date.toLocaleString('cs-CZ', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleString('cs-CZ', {
        day: '2-digit',
        month: '2-digit'
      });
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const pointValue = payload[0].value;
      
      const isMin = pointValue === metricLimits.min;
      const isMax = pointValue === metricLimits.max;
      return (
        <div
          style={{
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            padding: '10px',
            borderRadius: '8px'
          }}
        >
          <p>
            <strong>{formatXAxis(label)}</strong>
          </p>
          <p>
            {metrics[selectedMetric].label}: {pointValue}
          </p>
          {isMin && (
            <p style={{ color: 'blue' }}>
              Min Recommendation: {recommendations[selectedMetric].min}
            </p>
          )}
          {isMax && (
            <p style={{ color: 'red' }}>
              Max Recommendation: {recommendations[selectedMetric].max}
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const getStatisticsTitle = () => {
    switch(displayType) {
      case 'day':
        return 'Statistická analýza dne';
      case 'week':
        return 'Statistická analýza týdne';
      case 'month':
        return 'Statistická analýza měsíce';
      default:
        return 'Statistická analýza';
    }
  };

  const getInOptimalRangePercentage = () => {
    if (filteredData.length === 0) return 0;
    const range = optimalRanges[selectedMetric];
    const countInRange = filteredData.filter(
      (d) => d[selectedMetric] >= range.min && d[selectedMetric] <= range.max
    ).length;
    return ((countInRange / filteredData.length) * 100).toFixed(1);
  };

  const getAverage = () => {
    if (filteredData.length === 0) return null;
    const sum = filteredData.reduce((acc, d) => acc + d[selectedMetric], 0);
    return (sum / filteredData.length).toFixed(1);
  };

  const getTrend = () => {
    if (filteredData.length < 2) return 'N/A';
    const first = filteredData[0][selectedMetric];
    const last = filteredData[filteredData.length - 1][selectedMetric];
    if (last > first) return 'Stoupajici';
    if (last < first) return 'Klesajici';
    return 'Stabilni';
  };

  const getTimeOutsideOptimal = () => {
    if (filteredData.length === 0) return 0;
    const range = optimalRanges[selectedMetric];
    const outside = filteredData.filter(
      (d) => d[selectedMetric] < range.min || d[selectedMetric] > range.max
    );
    // Pro denní zobrazení počítáme hodiny, pro týdenní dny
    if (displayType === 'day') {
      return outside.length;
    } else {
      return (outside.length).toFixed(1);
    }
  };

  const getTimeOutsideOptimalLabel = () => {
    switch(displayType) {
      case 'day':
        return 'hodin';
      case 'week':
        return 'dní';
      case 'month':
        return 'dní';
      default:
        return 'měření';
    }
  };

  const getAlert = () => {
    const percentage = getInOptimalRangePercentage();
    if (percentage < 50) {
      return `⚠️ Pozor: pouze ${percentage}% měření bylo v optimálním rozmezí!`;
    }
    return null;
  };

  const getStandardDeviation = () => {
    if (filteredData.length === 0) return null;
    const mean = filteredData.reduce((acc, d) => acc + d[selectedMetric], 0) / filteredData.length;
    const squareDiffs = filteredData.map(d => Math.pow(d[selectedMetric] - mean, 2));
    const avgSquareDiff = squareDiffs.reduce((acc, val) => acc + val, 0) / squareDiffs.length;
    return Math.sqrt(avgSquareDiff).toFixed(2);
  };

  const getMedian = () => {
    if (filteredData.length === 0) return null;
    const sorted = [...filteredData].sort((a, b) => a[selectedMetric] - b[selectedMetric]);
    const middle = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
      return ((sorted[middle - 1][selectedMetric] + sorted[middle][selectedMetric]) / 2).toFixed(1);
    }
    return sorted[middle][selectedMetric].toFixed(1);
  };

  const getLongestStreak = () => {
    if (filteredData.length === 0) return { inRange: 0, outOfRange: 0 };
    const range = optimalRanges[selectedMetric];
    let currentInRangeStreak = 0;
    let maxInRangeStreak = 0;
    let currentOutOfRangeStreak = 0;
    let maxOutOfRangeStreak = 0;

    filteredData.forEach(d => {
      const value = d[selectedMetric];
      const isInRange = value >= range.min && value <= range.max;

      if (isInRange) {
        currentInRangeStreak++;
        currentOutOfRangeStreak = 0;
        maxInRangeStreak = Math.max(maxInRangeStreak, currentInRangeStreak);
      } else {
        currentOutOfRangeStreak++;
        currentInRangeStreak = 0;
        maxOutOfRangeStreak = Math.max(maxOutOfRangeStreak, currentOutOfRangeStreak);
      }
    });

    return {
      inRange: maxInRangeStreak,
      outOfRange: maxOutOfRangeStreak
    };
  };

  const currentRange = optimalRanges[selectedMetric];
  const chartUpperLimit = Math.max(metricLimits.max, currentRange.max + 10);

  const getTwoHourTicks = (data) => {
    const startHour = new Date(data[0]?.timestamp).getHours();
    return data.filter(entry => {
      const hour = new Date(entry.timestamp).getHours();
      return (hour - startHour) % 2 === 0;
    }).map(d => d.timestamp);
  };

  const inputStyle = {
    padding: '6px 10px',
    borderRadius: '8px',
    fontSize: '16px',
    width: '200px',
    height: '40px',
    border: '1px solid #ccc',
    lineHeight: 'normal',
    boxSizing: 'border-box',
    backgroundColor: 'white'
  };

  const dateInputStyle = {
    ...inputStyle,
    padding: '4px 10px',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    display: 'flex',
    alignItems: 'center'
  };

  const controlsContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
    width: '100%'
  };

  const getPeriodString = () => {
    if (displayType === 'day') {
      return selectedDate;
    } else if (displayType === 'week') {
      const weekDates = getWeekDates(selectedDate);
      return `${weekDates[0]}_to_${weekDates[weekDates.length - 1]}`;
    } else {
      const monthDates = getMonthDates(selectedDate);
      return `${monthDates[0]}_to_${monthDates[monthDates.length - 1]}`;
    }
  };

  const generateCSV = () => {
    const period = getPeriodString();
    
    // Příprava statistických dat pro všechny metriky
    const allMetricsStats = Object.entries(metrics).map(([metricKey, metricInfo]) => {
      const originalMetric = selectedMetric;
      setSelectedMetric(metricKey);
      
      const stats = {
        'Název veličiny': metricInfo.label,
        'Průměrná hodnota': `${getAverage()} ${metricInfo.label.split(' ')[1]}`,
        'Mediánová hodnota': `${getMedian()} ${metricInfo.label.split(' ')[1]}`,
        'Směrodatná odchylka': `${getStandardDeviation()} ${metricInfo.label.split(' ')[1]}`,
        'Hodnoty v optimálním rozsahu': `${getInOptimalRangePercentage()} %`,
        'Čas mimo optimální rozsah': `${getTimeOutsideOptimal()} ${getTimeOutsideOptimalLabel()}`,
        'Optimální rozsah hodnot': `${optimalRanges[metricKey].min} - ${optimalRanges[metricKey].max} ${metricInfo.label.split(' ')[1]}`,
        'Trend vývoje': getTrend(),
        'Nejdelší sekvence v optimálním rozsahu': `${getLongestStreak().inRange} měření`,
        'Nejdelší sekvence mimo optimální rozsah': `${getLongestStreak().outOfRange} měření`
      };
      
      setSelectedMetric(originalMetric);
      return stats;
    });

    // Přidání obecných informací
    const generalInfo = {
      'Typ zobrazení': displayType === 'day' ? 'Denní přehled' : displayType === 'week' ? 'Týdenní přehled' : 'Měsíční přehled',
      'Sledované období': period.replace(/_to_/g, ' až ')
    };

    // Příprava CSV dat
    const headers = ['Statistická veličina', ...Object.values(metrics).map(m => m.label)];
    
    // Vytvoření řádků s daty
    const rows = [
      // Obecné informace
      ['OBECNÉ INFORMACE', '', '', ''],
      ...Object.entries(generalInfo).map(([key, value]) => 
        [key, value, '', '']),
      ['', '', '', ''], // Prázdný řádek pro oddělení
      
      // Statistiky pro všechny veličiny
      ['STATISTICKÁ ANALÝZA', '', '', ''],
      ...Object.keys(allMetricsStats[0]).map(statKey => 
        [statKey, ...allMetricsStats.map(stat => stat[statKey])])
    ];

    // Přidání BOM pro správné zobrazení češtiny v Excelu a nastavení kódování
    const BOM = new Uint8Array([0xEF, 0xBB, 0xBF]);
    
    // Převod na CSV s použitím středníku jako oddělovače (běžné v českém prostředí)
    const csvContent = [
      headers.join(';'),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(';'))
    ].join('\r\n');

    // Vytvoření Blob s správným kódováním
    const blob = new Blob([BOM, csvContent], { 
      type: 'text/csv;charset=UTF-8'
    });

    // Vytvoření a stažení souboru
    const link = document.createElement('a');
    const filename = `statistiky_skleník_${period.replace(/_to_/g, '_až_')}.csv`;
    
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, filename);
    } else {
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const generatePDF = async () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let currentY = 20;

      // Nastavení výchozího fontu
      pdf.setFont("helvetica");

      // Nadpis
      pdf.setFontSize(16);
      const title = "Statisticka analyza skleniku";
      pdf.text(title, pageWidth / 2, currentY, { align: 'center' });
      currentY += 15;

      // Obecné informace
      pdf.setFontSize(12);
      const period = getPeriodString().replace(/_to_/g, ' az ');
      const viewType = displayType === 'day' ? 'Denni prehled' : displayType === 'week' ? 'Tydeni prehled' : 'Mesicni prehled';
      pdf.text(`Typ zobrazeni: ${viewType}`, 20, currentY);
      currentY += 8;
      pdf.text(`Sledovane obdobi: ${period}`, 20, currentY);
      currentY += 20;

      // Graf aktuálně vybrané veličiny
      if (chartRef.current) {
        pdf.setFontSize(14);
        const chartLabel = metrics[selectedMetric].label.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        pdf.text(`Graf prubehu - ${chartLabel}`, 20, currentY);
        currentY += 10;

        const canvas = await html2canvas(chartRef.current);
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 40;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 20, currentY, imgWidth, imgHeight);
        currentY += imgHeight + 20;
      }

      // Statistiky pro všechny veličiny
      pdf.setFontSize(14);
      pdf.text('Statisticka analyza vsech velicin', 20, currentY);
      currentY += 15;

      Object.entries(metrics).forEach(([metricKey, metricInfo]) => {
        if (currentY > pageHeight - 80) {
          pdf.addPage();
          currentY = 20;
        }

        const originalMetric = selectedMetric;
        setSelectedMetric(metricKey);

        // Nadpis sekce
        pdf.setFontSize(13);
        const metricLabel = metricInfo.label.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        pdf.text(metricLabel, 20, currentY);
        currentY += 8;

        // Statistiky pro danou veličinu
        pdf.setFontSize(11);
        const stats = [
          [`* Prumerna hodnota: ${getAverage()} ${metricInfo.label.split(' ')[1]}`],
          [`* Medianova hodnota: ${getMedian()} ${metricInfo.label.split(' ')[1]}`],
          [`* Smerodatna odchylka: ${getStandardDeviation()} ${metricInfo.label.split(' ')[1]}`],
          [`* Hodnoty v optimalnim rozsahu: ${getInOptimalRangePercentage()} %`],
          [`* Cas mimo optimalni rozsah: ${getTimeOutsideOptimal()} ${getTimeOutsideOptimalLabel()}`],
          [`* Optimalni rozsah hodnot: ${optimalRanges[metricKey].min} - ${optimalRanges[metricKey].max} ${metricInfo.label.split(' ')[1]}`],
          [`* Trend vyvoje: ${getTrend()}`],
          [`* Nejdelsi sekvence v optimalnim rozsahu: ${getLongestStreak().inRange} mereni`],
          [`* Nejdelsi sekvence mimo optimalni rozsah: ${getLongestStreak().outOfRange} mereni`]
        ];

        stats.forEach(([text]) => {
          if (currentY > pageHeight - 20) {
            pdf.addPage();
            currentY = 20;
          }
          const normalizedText = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          pdf.text(normalizedText, 25, currentY);
          currentY += 7;
        });

        currentY += 15;
        setSelectedMetric(originalMetric);
      });

      // Uložení PDF
      const filename = `statistiky_sklenik_${period.replace(/ az /g, '_az_')}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error('Chyba při generování PDF:', error);
    }
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '10px',
    marginTop: '20px'
  };

  const buttonStyle = {
    backgroundColor: '#014421',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s',
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  };

  return (
    <div
      style={{
        backgroundColor: '#f5f9fc',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0px 0px 10px rgba(0,0,0,0.1)'
      }}
    >
      <h2 style={{ textAlign: 'center', color: '#014421' }}>
        Sledování podmínek ve skleníku
      </h2>

      <div style={controlsContainerStyle}>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => {
            console.log('Selected date from calendar:', e.target.value);
            setSelectedDate(e.target.value);
          }}
          style={dateInputStyle}
        />
        <select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          style={inputStyle}
        >
          <option value="temperature">Teplota (°C)</option>
          <option value="humidity">Vlhkost vzduchu (%)</option>
          <option value="soilMoisture">Vlhkost půdy (%)</option>
          <option value="lightLevel">Světlo (lx)</option>
        </select>
        <select
          value={displayType}
          onChange={(e) => setDisplayType(e.target.value)}
          style={inputStyle}
        >
          <option value="day">Den</option>
          <option value="week">Týden</option>
          <option value="month">Měsíc</option>
        </select>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#e8f5e9',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0px 2px 6px rgba(0,0,0,0.1)',
        width: 'auto',
        maxWidth: '100%',
        margin: '0 20px 20px 20px',
        boxSizing: 'border-box'
      }}>
        {filteredData.length === 0 ? (
          <p style={{ color: '#555' }}>Žádná data pro statistiku.</p>
        ) : (
          <>
            <h3 style={{ margin: '0 0 15px 0', color: '#2c5282', width: '100%', textAlign: 'center' }}>
              {getStatisticsTitle()}
            </h3>
            
            <div ref={statsRef} style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              width: '100%'
            }}>
              {/* Základní statistiky */}
              <div style={{ 
                backgroundColor: 'white', 
                padding: '15px', 
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#2d3748' }}>Základní metriky</h4>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                  📊 Průměr: <strong>{getAverage()} {metrics[selectedMetric].label.split(' ')[1]}</strong>
                </p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                  📈 Medián: <strong>{getMedian()} {metrics[selectedMetric].label.split(' ')[1]}</strong>
                </p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                  📏 Směrodatná odchylka: <strong>{getStandardDeviation()}</strong>
                </p>
              </div>

              {/* Optimální rozsah */}
              <div style={{ 
                backgroundColor: 'white', 
                padding: '15px', 
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#2d3748' }}>Optimální rozsah</h4>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                  ✅ V rozsahu: <strong>{getInOptimalRangePercentage()}%</strong>
                </p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                  ⏳ Doba mimo optimum: <strong>{getTimeOutsideOptimal()} {getTimeOutsideOptimalLabel()}</strong>
                </p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                  🎯 Optimální rozsah: <strong>{optimalRanges[selectedMetric].min} - {optimalRanges[selectedMetric].max}</strong>
                </p>
              </div>

              {/* Trendy a sekvence */}
              <div style={{ 
                backgroundColor: 'white', 
                padding: '15px', 
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#2d3748' }}>Trendy a sekvence</h4>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                  📈 Trend: <strong>{getTrend()}</strong>
                </p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                  ✨ Nejdelší sekvence v optimu: <strong>{getLongestStreak().inRange} měření</strong>
                </p>
                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                  ⚠️ Nejdelší sekvence mimo optimum: <strong>{getLongestStreak().outOfRange} měření</strong>
                </p>
              </div>
            </div>

            <div style={buttonContainerStyle}>
              <button 
                onClick={generateCSV}
                style={buttonStyle}
              >
                📊 Stáhnout CSV
              </button>
              <button 
                onClick={generatePDF}
                style={buttonStyle}
              >
                📄 Stáhnout PDF
              </button>
            </div>

            {getAlert() && (
              <div style={{ 
                backgroundColor: '#fff5f5', 
                border: '1px solid #fc8181',
                borderRadius: '8px',
                padding: '10px',
                marginTop: '20px',
                width: '100%',
                textAlign: 'center'
              }}>
                <p style={{ color: '#c53030', margin: 0, fontWeight: 'bold' }}>
                  {getAlert()}
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {filteredData.length === 0 ? (
        <p style={{ textAlign: 'center', color: 'red', margin: '0 20px' }}>
          Pro tento týden nejsou žádná data dostupná.
        </p>
      ) : (
        <div ref={chartRef} style={{ 
          width: 'auto', 
          maxWidth: '100%', 
          margin: '0 20px',
          boxSizing: 'border-box'
        }}>
          <ResponsiveContainer width="100%" height={450}>
            <LineChart 
              data={filteredData} 
              margin={{ 
                top: 20, 
                right: 30, 
                left: 30, 
                bottom: 10 
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatXAxis}
                ticks={getTwoHourTicks(filteredData)}
                minTickGap={30}
                padding={{ left: 10, right: 10 }}
              />
              <YAxis domain={[0, chartUpperLimit]} />
              <Tooltip content={<CustomTooltip />} />

              <ReferenceArea
                y1={0}
                y2={currentRange.min}
                strokeOpacity={0}
                fill="#ffcccc"
                fillOpacity={0.5}
              />
              <ReferenceArea
                y1={currentRange.min}
                y2={currentRange.max}
                strokeOpacity={0}
                fill="#ccffcc"
                fillOpacity={0.5}
              />
              <ReferenceArea
                y1={currentRange.max}
                y2={chartUpperLimit}
                strokeOpacity={0}
                fill="#ffcccc"
                fillOpacity={0.5}
              />

              <ReferenceLine
                y={currentRange.min}
                stroke="#00cc00"
                strokeDasharray="3 3"
                strokeWidth={2}
                label={{ value: 'Min Optimal', position: 'insideRight' }}
              />
              <ReferenceLine
                y={currentRange.max}
                stroke="#00cc00"
                strokeDasharray="3 3"
                strokeWidth={2}
                label={{ value: 'Max Optimal', position: 'insideRight' }}
              />

              <Line
                type="monotone"
                dataKey={selectedMetric}
                stroke={metrics[selectedMetric].color}
                name={metrics[selectedMetric].label}
                dot={(props) => {
                  const value = props.payload[selectedMetric];
                  const isOutOfRange = value < optimalRanges[selectedMetric].min || value > optimalRanges[selectedMetric].max;
                  return (
                    <circle
                      cx={props.cx}
                      cy={props.cy}
                      r={3}
                      fill={isOutOfRange ? '#ff0000' : '#00cc00'}
                      stroke={isOutOfRange ? '#ff0000' : '#00cc00'}
                    />
                  );
                }}
              />

              {minPoint && (
                <ReferenceDot
                  x={minPoint.timestamp}
                  y={minPoint[selectedMetric]}
                  r={6}
                  fill="blue"
                  stroke="blue"
                  label={{
                    value: `Min: ${minPoint[selectedMetric]}`,
                    position: 'top',
                    fill: 'blue',
                    fontSize: 12
                  }}
                />
              )}

              {maxPoint && (
                <ReferenceDot
                  x={maxPoint.timestamp}
                  y={maxPoint[selectedMetric]}
                  r={6}
                  fill="red"
                  stroke="red"
                  label={{
                    value: `Max: ${maxPoint[selectedMetric]}`,
                    position: 'top',
                    fill: 'red',
                    fontSize: 12
                  }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default GreenhouseWeeklyChart;
