'use client';

import axios from 'axios';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Paper from '@mui/material/Paper';
import { alpha } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { useSettingsContext } from 'src/components/settings';

// ----------------------------------------------------------------------

export default function OneView() {
  const settings = useSettingsContext();
  const [financialData, setFinancialData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState({
    from: '2021-07',
    to: '2023-12',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = sessionStorage.getItem('accessToken');

        const response = await axios.get('https://interview.m-inno.com/api/figures/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const { data } = response.data;
        setFinancialData(data);
      } catch (error) {
        console.error('Error fetching financial data:', error);
      }
    };

    fetchData();
  }, []);

  const filteredData = financialData.filter((item) => {
    const currentPeriod = `${item.attributes.yearPeriod}-${item.attributes.monthPeriod}`;
    return currentPeriod >= selectedPeriod.from && currentPeriod <= selectedPeriod.to;
  });

  const totalAmount = filteredData.reduce((acc, item) => acc + item.attributes.totalAmount, 0);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4"> Page One </Typography>

      <Box
        sx={{
          mt: 5,
          width: 1,
          height: 320,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.04),
          border: (theme) => `dashed 1px ${theme.palette.divider}`,
          overflow: 'auto',
        }}
      >
        {/* 日期區間選擇 */}
        <Box sx={{ mb: 3, mt: 2 }}>
          <TextField
            label="From"
            type="month"
            value={selectedPeriod.from}
            onChange={(e) => setSelectedPeriod((prev) => ({ ...prev, from: e.target.value }))}
          />
          <TextField
            label="To"
            type="month"
            value={selectedPeriod.to}
            onChange={(e) => setSelectedPeriod((prev) => ({ ...prev, to: e.target.value }))}
          />
        </Box>

        {/* 資料表格 */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Year</TableCell>
                <TableCell>Month</TableCell>
                <TableCell>Total Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.attributes.yearPeriod}</TableCell>
                  <TableCell>{item.attributes.monthPeriod}</TableCell>
                  <TableCell>{item.attributes.totalAmount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* 資料總額計算 */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">{`Total Amount for selected period: ${totalAmount}`}</Typography>
      </Box>
    </Container>
  );
}
