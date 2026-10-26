$(document).ready(function () {
  var STORAGE_KEY = 'meownesa_feeding_data';

  function getStoredFeeding() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return window.defaultFeedingRows || [];
  }

  var feedingRows = getStoredFeeding();

  function saveFeeding() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(feedingRows));
    } catch (e) {}
  }

  function makeBtn(id, catKey, status) {
    var isDone = status === 'done';
    var cls = isDone ? 'btn-done' : 'btn-pending';
    var text = isDone ? '&check; Done' : '- Belum -';
    return '<button type="button" class="btn-feeding-status ' + cls + '" data-id="' + id + '" data-cat="' + catKey + '">' + text + '</button>';
  }

  function renderFeeding() {
    var $tbody = $('#feedingTableBody');
    $tbody.empty();
    if (!feedingRows.length) {
      $tbody.append('<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--ink-muted);">Belum ada jadwal pakan tercatat.</td></tr>');
      return;
    }
    feedingRows.forEach(function (row) {
      var tr = '<tr>' +
        '<td class="sheet-date-col">' + row.date + '</td>' +
        '<td>' + makeBtn(row.id, 'celli', row.celli) + '</td>' +
        '<td>' + makeBtn(row.id, 'bleki', row.bleki) + '</td>' +
        '<td>' + makeBtn(row.id, 'miso', row.miso) + '</td>' +
        '<td>' + makeBtn(row.id, 'lala', row.lala) + '</td>' +
        '<td>' + makeBtn(row.id, 'boby', row.boby) + '</td>' +
        '<td><div style="display:flex; gap:4px; justify-content:center;">' +
          '<button type="button" class="btn-icon btn-edit-feed" data-id="' + row.id + '" title="Edit">&#9998;</button>' +
          '<button type="button" class="btn-icon btn-delete-feed" data-id="' + row.id + '" title="Hapus">&#128465;</button>' +
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

  $(document).off('.feeding');

  $(document).on('click.feeding', '.btn-feeding-status', function () {
    var id = $(this).data('id');
    var catKey = $(this).data('cat');
    var row = feedingRows.find(function (r) { return r.id === id; });
    if (row) {
      row[catKey] = row[catKey] === 'done' ? 'pending' : 'done';
      saveFeeding();
      renderFeeding();
    }
  });

  $(document).on('click.feeding', '#btnMarkAllDone', function () {
    feedingRows.forEach(function (r) {
      r.celli = 'done';
      r.bleki = 'done';
      r.miso = 'done';
      r.lala = 'done';
      r.boby = 'done';
    });
    saveFeeding();
    renderFeeding();
  });

  $(document).on('click.feeding', '.sheet-tab-btn', function () {
    $('.sheet-tab-btn').removeClass('active');
    $(this).addClass('active');
    $('#activeZoneLabel').text($(this).text());
  });

  $(document).on('click.feeding', '#btnOpenAddFeeding', function () {
    clearErrors();
    $('#modalFeedFormTitle').text('Catat Jadwal Feeding Baru');
    $('#editFeedId').val('');
    $('#editFeedDate').val('');
    $('#editFeedVolunteer').val('Sarah & Dimas');
    $('#editFeedNotes').val('');
    $('#editFeedCelli').val('done');
    $('#editFeedBleki').val('done');
    $('#editFeedMiso').val('done');
    $('#editFeedLala').val('done');
    $('#editFeedBoby').val('done');
    $('#modalEditFeeding').fadeIn(200);
  });

  $(document).on('click.feeding', '.btn-edit-feed', function () {
    clearErrors();
    var id = $(this).data('id');
    var row = feedingRows.find(function (r) { return r.id === id; });
    if (!row) return;
    $('#modalFeedFormTitle').text('Ubah Catatan Feeding');
    $('#editFeedId').val(row.id);
    $('#editFeedDate').val(row.date);
    $('#editFeedVolunteer').val(row.volunteer || 'Sarah & Dimas');
    $('#editFeedNotes').val(row.notes || '');
    $('#editFeedCelli').val(row.celli || 'done');
    $('#editFeedBleki').val(row.bleki || 'done');
    $('#editFeedMiso').val(row.miso || 'done');
    $('#editFeedLala').val(row.lala || 'done');
    $('#editFeedBoby').val(row.boby || 'done');
    $('#modalEditFeeding').fadeIn(200);
  });

  $(document).on('click.feeding', '#closeModalEditFeed, #btnCancelEditFeed, #modalEditFeeding', function (e) {
    if (e.target === this) {
      $('#modalEditFeeding').fadeOut(150);
    }
  });

  $(document).on('submit.feeding', '#formEditFeeding', function (e) {
    e.preventDefault();
    clearErrors();

    var isValid = true;
    var date = $('#editFeedDate').val().trim();
    var volunteer = $('#editFeedVolunteer').val().trim();
    var notes = $('#editFeedNotes').val().trim();
    var celli = $('#editFeedCelli').val();
    var bleki = $('#editFeedBleki').val();
    var miso = $('#editFeedMiso').val();
    var lala = $('#editFeedLala').val();
    var boby = $('#editFeedBoby').val();

    if (!date || date.length < 5) {
      showError($('#editFeedDate'), $('#errFeedDate'), 'Tanggal wajib diisi (contoh: 05/10/2026).');
      isValid = false;
    }
    if (!volunteer || volunteer.length < 3) {
      showError($('#editFeedVolunteer'), $('#errFeedVolunteer'), 'Nama relawan minimal 3 karakter.');
      isValid = false;
    }
    if (!notes || notes.length < 5) {
      showError($('#editFeedNotes'), $('#errFeedNotes'), 'Catatan lapangan minimal 5 karakter.');
      isValid = false;
    }

    if (!isValid) return;

    var editId = $('#editFeedId').val();
    if (editId) {
      var target = feedingRows.find(function (r) { return r.id === editId; });
      if (target) {
        target.date = date; target.volunteer = volunteer; target.notes = notes;
        target.celli = celli; target.bleki = bleki; target.miso = miso;
        target.lala = lala; target.boby = boby;
      }
    } else {
      var newRow = {
        id: 'feed-' + Date.now(),
        date: date, volunteer: volunteer, notes: notes,
        celli: celli, bleki: bleki, miso: miso, lala: lala, boby: boby
      };
      feedingRows.unshift(newRow);
    }

    saveFeeding();
    renderFeeding();
    $('#modalEditFeeding').fadeOut(150);
  });

  $(document).on('click.feeding', '.btn-delete-feed', function () {
    var id = $(this).data('id');
    if (confirm('Yakin ingin menghapus baris jadwal pakan ini?')) {
      feedingRows = feedingRows.filter(function (r) { return r.id !== id; });
      saveFeeding();
      renderFeeding();
    }
  });

  renderFeeding();
});