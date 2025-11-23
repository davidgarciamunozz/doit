"use client";

import { UserProfile } from "@/app/actions/profile";
import { User, Mail, Calendar, Clock } from "lucide-react";

interface ProfileViewProps {
  profile: UserProfile;
}

export default function ProfileView({ profile }: ProfileViewProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Nunca";
    return new Date(dateString).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mi Perfil</h1>
          <p className="text-muted-foreground mt-1">Información de tu cuenta</p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-card-foreground mb-1">
                {profile.email.split("@")[0]}
              </h2>
              <p className="text-muted-foreground">{profile.email}</p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Correo electrónico
                  </p>
                  <p className="text-sm text-card-foreground">
                    {profile.email}
                  </p>
                  {profile.email_confirmed_at ? (
                    <span className="inline-flex items-center mt-1 text-xs text-green-600 dark:text-green-400">
                      ✓ Verificado
                    </span>
                  ) : (
                    <span className="inline-flex items-center mt-1 text-xs text-orange-600 dark:text-orange-400">
                      ⚠ No verificado
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Cuenta creada
                  </p>
                  <p className="text-sm text-card-foreground">
                    {formatDate(profile.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Último acceso
                  </p>
                  <p className="text-sm text-card-foreground">
                    {formatDate(profile.last_sign_in_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    ID de usuario
                  </p>
                  <p className="text-xs text-muted-foreground font-mono break-all">
                    {profile.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Account Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Estado de la cuenta
          </p>
          <p className="text-lg font-semibold text-card-foreground">
            {profile.email_confirmed_at ? "Activa" : "Pendiente"}
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Miembro desde
          </p>
          <p className="text-lg font-semibold text-card-foreground">
            {new Date(profile.created_at).toLocaleDateString("es-CO", {
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border p-4">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            Tipo de cuenta
          </p>
          <p className="text-lg font-semibold text-card-foreground">
            Emprendedor
          </p>
        </div>
      </div>
    </div>
  );
}
