$(document).ready(function () {
  var STORAGE_KEY = 'meownesa_monitoring_data';

  function getStoredMonitoring() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return window.defaultMonitorings || [];
  }

  var monitorings = getStoredMonitoring();

  function saveMonitoring() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(monitorings));
    } catch (e) {}
  }

  function renderMonitoring(data) {
    var $tbody = $('#monitoringTableBody');
    $tbody.empty();
    if (!data.length) {
      $tbody.append('<tr><td colspan="7" style="text-align: center; padding: 40px; color: var(--ink-muted);">Tidak ada data monitoring yang sesuai.</td></tr>');
      return;
    }
    data.forEach(function (m) {
      var isAlert = m.status.indexOf('Terlambat') !== -1 || m.status.indexOf('Visitasi') !== -1;
      var badge = isAlert
        ? '<span class="badge-status rawat">' + m.condition + '</span>'
        : '<span class="badge-green">' + m.condition + '</span>';
      var tr = '<tr>' +
        '<td><strong>' + m.cat + '</strong></td>' +
        '<td>' + m.adopter + '</td>' +
        '<td>' + m.dateAdopt + '</td>' +
        '<td>' + m.lastUpdate + '</td>' +
        '<td>' + m.status + '</td>' +
        '<td>' + badge + '</td>' +
        '<td><div style="display: flex; gap: 4px;">' +
          '<button type="button" class="btn-icon btn-detail-mon" data-id="' + m.id + '" title="Lihat">&#128065;</button>' +
          '<button type="button" class="btn-icon btn-edit-mon" data-id="' + m.id + '" title="Edit">&#9998;</button>' +
          '<button type="button" class="btn-icon btn-delete-mon" data-id="' + m.id + '" title="Hapus">&#128465;</button>' +
        '</div></td>' +
      '</tr>';
      $tbody.append(tr);
    });
  }

  function clearErrors() {
    $('.field-error').text('').hide();
    $('.filter-input, .filter-select').removeClass('input-error');
  }

  function showError($field, $err, msg) {
    $field.addClass('input-error');
    $err.text(msg).show();
  }

  function applyFilters() {
    var q = $('#searchMon').val().toLowerCase().trim();
    var filtered = monitorings.filter(function (m) {
      return !q || m.cat.toLowerCase().indexOf(q) !== -1 || m.adopter.toLowerCase().indexOf(q) !== -1 || m.status.toLowerCase().indexOf(q) !== -1;
    });
    renderMonitoring(filtered);
  }

  $(document).off('.monitoring');

  $(document).on('input.monitoring', '#searchMon', applyFilters);

  $(document).on('click.monitoring', '.btn-detail-mon', function () {
    var id = $(this).data('id');
    var m = monitorings.find(function (item) { return item.id === id; });
    if (!m) return;
    $('#modalMonId').text(m.id);
    $('#modalMonCat').text(m.cat);
    $('#modalMonAdopter').text(m.adopter);
    $('#modalMonPhone').text(m.phone || '-');
    $('#modalMonDateAdopt').text(m.dateAdopt);
    $('#modalMonLastUpdate').text(m.lastUpdate);
    $('#modalMonStatus').text(m.status);
    $('#modalMonCondition').text(m.condition);
    $('#modalMonNotes').text(m.notes || '-');
    $('#modalDetailMon').fadeIn(200);
  });

  $(document).on('click.monitoring', '#closeDetailMon, #btnCloseDetailMon, #modalDetailMon', function (e) {
    if (e.target === this) {
      $('#modalDetailMon').fadeOut(150);
    }
  });

  $(document).on('click.monitoring', '#btnOpenAddMon', function () {
    clearErrors();
    $('#modalMonFormTitle').text('Input Laporan Monitoring Baru');
    $('#editMonId').val('');
    $('#editMonCatName').val('');
    $('#editMonAdopter').val('');
    $('#editMonPhone').val('');
    $('#editMonStatus').prop('selectedIndex', 0);
    $('#editMonCondition').prop('selectedIndex', 0);
    var today = new Date().toISOString().split('T')[0];
    $('#editMonDateAdopt').val(today);
    $('#editMonLastUpdate').val(today);
    $('#editMonNotes').val('');
    $('#modalEditMon').fadeIn(200);
  });

  $(document).on('click.monitoring', '.btn-edit-mon', function () {
    clearErrors();
    var id = $(this).data('id');
    var m = monitorings.find(function (item) { return item.id === id; });
    if (!m) return;
    $('#modalMonFormTitle').text('Ubah Data Laporan Monitoring');
    $('#editMonId').val(m.id);
    $('#editMonCatName').val(m.cat);
    $('#editMonAdopter').val(m.adopter);
    $('#editMonPhone').val(m.phone || '');
    $('#editMonStatus').val(m.status);
    $('#editMonCondition').val(m.condition);
    $('#editMonDateAdopt').val(m.dateAdopt);
    $('#editMonLastUpdate').val(m.lastUpdate);
    $('#editMonNotes').val(m.notes || '');
    $('#modalEditMon').fadeIn(200);
  });

  $(document).on('click.monitoring', '#closeModalEditMon, #btnCancelEditMon, #modalEditMon', function (e) {
    if (e.target === this) {
      $('#modalEditMon').fadeOut(150);
    }
  });

  $(document).on('submit.monitoring', '#formEditMon', function (e) {
    e.preventDefault();
    clearErrors();

    var isValid = true;
    var cat = $('#editMonCatName').val().trim();
    var adopter = $('#editMonAdopter').val().trim();
    var phone = $('#editMonPhone').val().trim();
    var status = $('#editMonStatus').val();
    var condition = $('#editMonCondition').val();
    var dateAdopt = $('#editMonDateAdopt').val();
    var lastUpdate = $('#editMonLastUpdate').val();
    var notes = $('#editMonNotes').val().trim();

    if (!cat || cat.length < 2) {
      showError($('#editMonCatName'), $('#errMonCat'), 'Nama kucing minimal 2 karakter.');
      isValid = false;
    }
    if (!adopter || adopter.length < 3) {
      showError($('#editMonAdopter'), $('#errMonAdopter'), 'Nama adopter minimal 3 karakter.');
      isValid = false;
    }
    if (!phone || phone.length < 10 || !/^[0-9+\s-]+$/.test(phone)) {
      showError($('#editMonPhone'), $('#errMonPhone'), 'Nomor HP/WA valid minimal 10 digit.');
      isValid = false;
    }
    if (!dateAdopt) {
      showError($('#editMonDateAdopt'), $('#errMonDateAdopt'), 'Pilih tanggal adopsi.');
      isValid = false;
    }
    if (!lastUpdate) {
      showError($('#editMonLastUpdate'), $('#errMonLastUpdate'), 'Pilih tanggal laporan terakhir.');
      isValid = false;
    }
    if (!notes || notes.length < 5) {
      showError($('#editMonNotes'), $('#errMonNotes'), 'Catatan monitoring minimal 5 karakter.');
      isValid = false;
    }

    if (!isValid) return;

    var editId = $('#editMonId').val();
    if (editId) {
      var target = monitorings.find(function (item) { return item.id === editId; });
      if (target) {
        target.cat = cat; target.adopter = adopter; target.phone = phone;
        target.status = status; target.condition = condition;
        target.dateAdopt = dateAdopt; target.lastUpdate = lastUpdate; target.notes = notes;
      }
    } else {
      var newMon = {
        id: 'MON-' + String(Math.floor(100 + Math.random() * 900)),
        cat: cat, adopter: adopter, phone: phone,
        dateAdopt: dateAdopt, lastUpdate: lastUpdate,
        status: status, condition: condition, notes: notes
      };
      monitorings.unshift(newMon);
    }

    saveMonitoring();
    applyFilters();
    $('#modalEditMon').fadeOut(150);
  });

  $(document).on('click.monitoring', '.btn-delete-mon', function () {
    var id = $(this).data('id');
    if (confirm('Yakin ingin menghapus laporan monitoring ini?')) {
      monitorings = monitorings.filter(function (m) { return m.id !== id; });
      saveMonitoring();
      applyFilters();
    }
  });

  renderMonitoring(monitorings);
});