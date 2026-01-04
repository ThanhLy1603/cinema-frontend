<template>
  <div class="revenue-dashboard">
    <h2>📊 Thống kê doanh thu</h2>

    <!-- Cards -->
    <div class="cards">
      <div class="card">
        <p>Tổng doanh thu</p>
        <h3>{{ formatMoney(revenue.totalRevenue) }}</h3>
      </div>

      <div class="card">
        <p>Hôm nay</p>
        <h3>{{ formatMoney(revenue.todayRevenue) }}</h3>
      </div>

      <div class="card">
        <p>Tháng này</p>
        <h3>{{ formatMoney(revenue.monthRevenue) }}</h3>
      </div>

      <div class="card">
        <p>Năm nay</p>
        <h3>{{ formatMoney(revenue.yearRevenue) }}</h3>
      </div>
    </div>

    <!-- Filter -->
    <div class="filters">
      <label>Bộ lọc:</label>
      <select v-model="filterType" @change="renderChart">
        <option value="day">Theo ngày</option>
        <option value="month">Theo tháng</option>
        <option value="year">Theo năm</option>
      </select>
    </div>

    <!-- Chart -->
    <div class="chart-box">
      <canvas ref="dailyChart"></canvas>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { Chart } from "chart.js/auto";

export default {
  name: "RevenueDashboard",
  data() {
    return {
      revenue: {
        totalRevenue: 0,
        todayRevenue: 0,
        monthRevenue: 0,
        yearRevenue: 0,
        dailyRevenue: []
      },
      filterType: "day",
      chart: null
    };
  },
  mounted() {
    this.loadRevenue();
  },
  methods: {
    loadRevenue() {
      axios.get("http://localhost:8080/api/revenue")
        .then(res => {
          this.revenue = res.data;
          this.renderChart();
        })
        .catch(err => {
          console.error("Lỗi load doanh thu:", err);
        });
    },

    renderChart() {
      let labels = [];
      let data = [];

      // ===== LỌC THEO NGÀY =====
      if (this.filterType === "day") {
        labels = this.revenue.dailyRevenue.map(i => i[0]);
        data = this.revenue.dailyRevenue.map(i => i[1]);
      }

      // ===== LỌC THEO THÁNG =====
      if (this.filterType === "month") {
        const map = {};
        this.revenue.dailyRevenue.forEach(i => {
          const month = i[0].substring(0, 7); // yyyy-MM
          map[month] = (map[month] || 0) + i[1];
        });
        labels = Object.keys(map);
        data = Object.values(map);
      }

      // ===== LỌC THEO NĂM =====
      if (this.filterType === "year") {
        const map = {};
        this.revenue.dailyRevenue.forEach(i => {
          const year = i[0].substring(0, 4); // yyyy
          map[year] = (map[year] || 0) + i[1];
        });
        labels = Object.keys(map);
        data = Object.values(map);
      }

      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(this.$refs.dailyChart, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Doanh thu (VND)",
              data
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true }
          }
        }
      });
    },

    formatMoney(value) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND"
      }).format(value || 0);
    }
  }
};
</script>

<style scoped>
.revenue-dashboard {
  padding: 20px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.card p {
  margin: 0;
  color: #666;
}

.card h3 {
  margin-top: 8px;
  color: #2c3e50;
}

.filters {
  margin-bottom: 16px;
}

.filters label {
  margin-right: 8px;
  font-weight: 500;
}

.filters select {
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.chart-box {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
