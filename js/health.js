$(document).ready(function () {
  var STORAGE_KEY = 'meownesa_health_data';

  function getStoredHealth() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return window.defaultHealthRecords || window.medisData || [];
  }

  var records = getStoredHealth();

  function saveHealth() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch (e) {}
  }

  function renderHealth(data) {
    var $tbody = $('#healthTableBody');
    $tbody.empty();
    if (!data.length) {
      $tbody.append('<tr><td colspan="7" style="text-align: center; padding: 40px; color: var(--ink-muted);">Tidak ada rekam medis yang sesuai filter.</td></tr>');
      return;
    }
    data.forEach(function (rec) {
      var tr = '<tr>' +
        '<td><strong style="color: var(--magenta); font-size: 0.78rem;">' + rec.id.toUpperCase() + '</strong></td>' +
        '<td>' + rec.date + '</td>' +
        '<td><strong>' + rec.cat + '</strong></td>' +
        '<td><span class="badge-status lahap">' + rec.actionType + '</span></td>' +
        '<td>' + rec.clinic + '</td>' +
        '<td><span class="badge-green">' + rec.recoveryStatus + '</span></td>' +
        '<td><div style="display: flex; gap: 4px;">' +
          '<button type="button" class="btn-icon btn-detail-health" data-id="' + rec.id + '" title="Lihat Detail">&#128065;</button>' +
          '<button type="button" class="btn-icon btn-edit-health" data-id="' + rec.id + '" title="Edit">&#9998;</button>' +
          '<button type="button" class="btn-icon btn-delete-health" data-id="' + rec.id + '" title="Hapus">&#128465;</button>' +
        '</div></td>' +
      '</tr>';
      $tbody.append(tr);
    });
  }

  function applyFilters() {
    var search = $('#searchHealth').val().toLowerCase().trim();
    var action = $('#filterAction').val();
    var filtered = records.filter(function (r) {
      var matchSearch = !search ||
        r.cat.toLowerCase().indexOf(search) !== -1 ||
        r.notes.toLowerCase().indexOf(search) !== -1 ||
        r.clinic.toLowerCase().indexOf(search) !== -1;
      var matchAction = !action || r.actionType.indexOf(action) !== -1;
      return matchSearch && matchAction;
    });
    renderHealth(filtered);
  }

  function clearErrors() {
    $('.field-error').text('').hide();
    $('.filter-input, .filter-select').removeClass('input-error');
  }

  function showError($field, $err, msg) {
    $field.addClass('input-error');
    $err.text(msg).show();
  }

  $(document).off('.health');

  $(document).on('input.health', '#searchHealth', applyFilters);
  $(document).on('change.health', '#filterAction', applyFilters);

  $(document).on('click.health', '.btn-detail-health', function () {
    var id = $(this).data('id');
    var rec = records.find(function (r) { return r.id === id; });
    if (!rec) return;
    $('#modalHealthId').text(rec.id.toUpperCase());
    $('#modalHealthCat').text(rec.cat);
    $('#modalHealthDate').text(rec.date);
    $('#modalHealthAction').text(rec.actionType);
    $('#modalHealthClinic').text(rec.clinic);
    $('#modalHealthDoctor').text(rec.doctor);
    $('#modalHealthStatus').text(rec.recoveryStatus);
    $('#modalHealthControl').text(rec.nextControl || '-');
    $('#modalHealthCost').text('Rp ' + Number(rec.cost || 0).toLocaleString('id-ID'));
    $('#modalHealthNotes').text(rec.notes);
    $('#modalHealth').fadeIn(200);
  });

  $(document).on('click.health', '#closeModalHealth, #btnCloseModalHealth, #modalHealth', function (e) {
    if (e.target === this) {
      $('#modalHealth').fadeOut(150);
    }
  });

  $(document).on('click.health', '#btnOpenAddHealth', function () {
    clearErrors();
    $('#modalHealthFormTitle').text('Input Tindakan Medis Baru');
    $('#editHealthId').val('');
    $('#addCat').prop('selectedIndex', 0);
    $('#addDate').val(new Date().toISOString().split('T')[0]);
    $('#addAction').prop('selectedIndex', 0);
    $('#addStatus').prop('selectedIndex', 0);
    $('#addClinic').val('Klinik Nusantara Vet');
    $('#addDoctor').val('drh. Hendra Kurniawan');
    $('#addNotes').val('');
    $('#addCost').val('150000');
    $('#addControl').val('-');
    $('#modalAddHealth').fadeIn(200);
  });

  $(document).on('click.health', '.btn-edit-health', function () {
    clearErrors();
    var id = $(this).data('id');
    var rec = records.find(function (r) { return r.id === id; });
    if (!rec) return;
    $('#modalHealthFormTitle').text('Ubah Rekam Medis');
    $('#editHealthId').val(rec.id);
    $('#addCat').val(rec.cat);
    $('#addDate').val(rec.date);
    $('#addAction').val(rec.actionType);
    $('#addStatus').val(rec.recoveryStatus);
    $('#addClinic').val(rec.clinic);
    $('#addDoctor').val(rec.doctor);
    $('#addNotes').val(rec.notes);
    $('#addCost').val(rec.cost);
    $('#addControl').val(rec.nextControl);
    $('#modalAddHealth').fadeIn(200);
  });

  $(document).on('click.health', '#closeAddHealth, #btnCancelHealth, #modalAddHealth', function (e) {
    if (e.target === this) {
      $('#modalAddHealth').fadeOut(150);
    }
  });

  $(document).on('submit.health', '#formAddHealth', function (e) {
    e.preventDefault();
    clearErrors();

    var isValid = true;
    var cat = $('#addCat').val();
    var date = $('#addDate').val();
    var action = $('#addAction').val();
    var clinic = $('#addClinic').val().trim();
    var doctor = $('#addDoctor').val().trim();
    var notes = $('#addNotes').val().trim();
    var cost = Number($('#addCost').val());
    var status = $('#addStatus').val();
    var control = $('#addControl').val().trim() || '-';

    if (!cat) {
      showError($('#addCat'), $('#errHealthCat'), 'Pilih kucing.');
      isValid = false;
    }
    if (!date) {
      showError($('#addDate'), $('#errHealthDate'), 'Pilih tanggal tindakan.');
      isValid = false;
    }
    if (!clinic || clinic.length < 3) {
      showError($('#addClinic'), $('#errHealthClinic'), 'Nama klinik minimal 3 karakter.');
      isValid = false;
    }
    if (!doctor || doctor.length < 3) {
      showError($('#addDoctor'), $('#errHealthDoctor'), 'Nama dokter minimal 3 karakter.');
      isValid = false;
    }
    if (!notes || notes.length < 5) {
      showError($('#addNotes'), $('#errHealthNotes'), 'Catatan medis minimal 5 karakter.');
      isValid = false;
    }
    if (isNaN(cost) || cost < 0) {
      showError($('#addCost'), $('#errHealthCost'), 'Biaya harus angka valid.');
      isValid = false;
    }

    if (!isValid) return;

    var editId = $('#editHealthId').val();
    if (editId) {
      var target = records.find(function (r) { return r.id === editId; });
      if (target) {
        target.cat = cat; target.date = date; target.actionType = action;
        target.clinic = clinic; target.doctor = doctor; target.notes = notes;
        target.cost = cost; target.recoveryStatus = status; target.nextControl = control;
      }
    } else {
      var newRec = {
        id: 'med-' + (records.length + 1),
        date: date, cat: cat, actionType: action,
        clinic: clinic, doctor: doctor, notes: notes,
        recoveryStatus: status, nextControl: control, cost: cost
      };
      records.unshift(newRec);
    }

    saveHealth();
    applyFilters();
    $('#modalAddHealth').fadeOut(150);
  });

  $(document).on('click.health', '.btn-delete-health', function () {
    var id = $(this).data('id');
    if (confirm('Yakin ingin menghapus rekam medis ini?')) {
      records = records.filter(function (r) { return r.id !== id; });
      saveHealth();
      applyFilters();
    }
  });

  renderHealth(records);
});