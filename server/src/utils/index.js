const mapDBToModel = ({ 
    id,
    title,
    date,
    body,
    created_at,
    updated_at,
  }) => ({
    id,
    title,
    date,
    body,
    createdAt: created_at,
    updatedAt: updated_at,
  });
   
  module.exports = { mapDBToModel };