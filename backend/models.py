from database import db

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    full_name = db.Column(db.String(100), nullable=False)

    email = db.Column(db.String(120), unique=True, nullable=False)

    password = db.Column(db.String(255), nullable=False)

    created_at = db.Column(db.DateTime, server_default=db.func.now())

    def __repr__(self):
        return f"<User {self.email}>"
    
class Contract(db.Model):
    __tablename__ = "contracts"

    id = db.Column(db.Integer, primary_key=True)

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    contract_type = db.Column(db.String(100), nullable=False)

    mode = db.Column(db.String(30), nullable=False)
    # Generated / Uploaded

    title = db.Column(db.String(200), nullable=False)

    content = db.Column(db.Text, nullable=False)

    created_at = db.Column(
        db.DateTime,
        default=db.func.current_timestamp()
    )